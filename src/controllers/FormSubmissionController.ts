import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { FormSubmission, Answer, Form, Church } from "../models";
import { Permissions, EmailHelper, Environment } from "../helpers";
import { MemberPermission, Person } from "../models";
import axios, { AxiosRequestConfig } from "axios";


@controller("/formsubmissions")
export class FormSubmissionController extends MembershipBaseController {

  @httpGet("/:id")
  public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.forms.admin) || !au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
      const result: FormSubmission = this.repositories.formSubmission.convertToModel(au.churchId, await this.repositories.formSubmission.load(au.churchId, id));
      if (this.include(req, "form")) await this.appendForm(au.churchId, result);
      if (this.include(req, "questions")) await this.appendQuestions(au.churchId, result);
      if (this.include(req, "answers")) await this.appendAnswers(au.churchId, result);
      return result;
    });
  }

  @httpGet("/")
  public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.forms.admin) || !au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
      else {
        let result = null;
        if (req.query.personId !== undefined) result = await this.repositories.formSubmission.loadForContent(au.churchId, "person", req.query.personId.toString());
        else if (req.query.formId !== undefined) result = await this.repositories.formSubmission.loadByFormId(au.churchId, req.query.formId.toString());
        else result = await this.repositories.formSubmission.loadAll(au.churchId);
        return this.repositories.formSubmission.convertAllToModel(au.churchId, result);
      }
    });
  }

  @httpGet("/formId/:formId")
  public async getByFormId(@requestParam("formId") formId: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!this.formAccess(au, formId)) return this.json([], 401);
      else {
        const formSubmissions = await this.repositories.formSubmission.convertAllToModel(au.churchId, await this.repositories.formSubmission.loadByFormId(au.churchId, formId));
        const promises: Promise<FormSubmission>[] = [];
        formSubmissions.forEach((formSubmission: FormSubmission) => {
          promises.push(this.appendForm(au.churchId, formSubmission));
          promises.push(this.appendQuestions(au.churchId, formSubmission));
          promises.push(this.appendAnswers(au.churchId, formSubmission));
        });
        await Promise.all(promises);
        return formSubmissions;
      }
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, FormSubmission[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {

      if (req.body?.length > 0) {
        const results: any[] = [];
        for (const formSubmission of req.body) {
          const { formId } = formSubmission;
          let { churchId } = formSubmission;

          if (!churchId && au) churchId = au.churchId;
          const formAccess = await this.repositories.form.access(formId);
          const form = formAccess && this.repositories.form.convertToModel(churchId, formAccess);

          if (!form) {
            results.push({ error: `Form with id ${formId} not found` });
          } else if (form.restricted && !this.formAccess(au, formId)) {
            results.push({ error: `You're not allowed to submit ${form.name}` });
          } else {
            formSubmission.churchId = churchId;
            const savedSubmissions = await this.repositories.formSubmission.save(formSubmission);

            const answerPromises: Promise<Answer>[] = [];
            formSubmission?.answers?.forEach(answer => {
              if (!answer.churchId) answer.churchId = churchId;
              answer.formSubmissionId = savedSubmissions.id;
              answerPromises.push(this.repositories.answer.save(answer));
            })
            if (answerPromises.length > 0) {
              await Promise.all(answerPromises);
            }

            results.push(savedSubmissions);

            await this.sendEmails(formSubmission, form, churchId);

          }
        }

        return results;
      }

      // return { error: "Please check body. formsubmissions is required" }
    })
  };

  private async sendEmails(formSubmission: FormSubmission, form:Form, churchId: string) {
    // send email to form members that have emailNotification set to true
    const memberPermissions = await this.repositories.memberPermission.loadByEmailNotification(churchId, true);
    const church: Church = await this.repositories.church.loadById(churchId);
    if (memberPermissions?.length > 0) {
      const ids = memberPermissions.map((mp: MemberPermission) => mp.memberId);
      if (ids?.length > 0) {
        const people = await this.repositories.person.loadByIds(formSubmission.churchId, ids);
        if (people?.length > 0) {
          const contentRows: any[] = [];
          formSubmission.questions.forEach(q => {
            formSubmission.answers.forEach(a => {
              if (q.id === a.questionId) {
                contentRows.push(
                  `<tr><th style="font-size: 16px" width="30%">` + q.title + `</th><td style="font-size: 15px">` + a.value + `</td></tr>`
                )
              }
            })
          })

          const contents = `<table role="presentation" style="text-align: left;" cellspacing="8" width="80%"><tablebody>` + contentRows.join(" ") + `</tablebody></table>`
          const promises: Promise<any>[] = [];
          people.forEach((p: Person) => {
            promises.push(EmailHelper.sendTemplatedEmail(Environment.supportEmail, p.email, church.name, Environment.chumsRoot, "New Submissions for " + form.name, contents));
          })
          promises.push(this.sendNotifications(churchId, form, ids));
          await Promise.all(promises);
        }
      }
    }
  }

  private async sendNotifications(churchId:string, form:Form, peopleIds: string[]) {
    const data = { churchId, peopleIds, contentType:"form", contentId:form.id, message:"New Form Submission: " + form.name };
    // todo add some kind of auth token and check for it. Can't be jwt since submissions can be anonymous.  Need to encrypt something
    // const config:AxiosRequestConfig = { headers: { "Authorization": "Bearer " + au.jwt } };
    return axios.post(Environment.messagingApi + "/notifications/ping", data);
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.forms.admin) || !au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
      else {
        await this.repositories.answer.deleteForSubmission(au.churchId, id);
        await new Promise(resolve => setTimeout(resolve, 500)); // I think it takes a split second for the FK restraints to see the answers were deleted sometimes and the delete below fails.
        await this.repositories.formSubmission.delete(au.churchId, id);
        return this.json({});
      }
    });
  }

  private async appendForm(churchId: string, formSubmission: FormSubmission) {
    const data = await this.repositories.form.load(churchId, formSubmission.formId);
    formSubmission.form = this.repositories.form.convertToModel(churchId, data);
    return formSubmission;
  }

  private async appendQuestions(churchId: string, formSubmission: FormSubmission) {
    const data = await this.repositories.question.loadForForm(churchId, formSubmission.formId);
    formSubmission.questions = this.repositories.question.convertAllToModel(churchId, data);
    return formSubmission;
  }

  private async appendAnswers(churchId: string, formSubmission: FormSubmission) {
    const data = await this.repositories.answer.loadForFormSubmission(churchId, formSubmission.id);
    formSubmission.answers = this.repositories.answer.convertAllToModel(churchId, data);
    return formSubmission;
  }

}
