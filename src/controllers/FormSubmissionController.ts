import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { FormSubmission, Answer } from "../apiBase/models";
import { Permissions, EmailHelper, Environment } from "../helpers";
import { MemberPermission, Person } from "../models";

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
      const formId = req.body[0]?.formId;
      const churchId = req.body[0]?.churchId;
      const formName = req.body[0]?.formName;
      const sendEmail = req.body[0]?.sendEmail;
      const form = this.repositories.form.convertToModel(churchId, await this.repositories.form.access(formId));
      if (form.restricted && !this.formAccess(au, formId)) return this.json([], 401);
      else {
        const promises: Promise<FormSubmission>[] = [];
        req.body.forEach(formsubmission => { formsubmission.churchId = churchId; promises.push(this.repositories.formSubmission.save(formsubmission)); });
        const result = await Promise.all(promises);

        const answerPromises: Promise<Answer>[] = []
        for (let i = 0; i < req.body.length; i++) {
          const answers = req.body[i].answers;
          if (answers !== undefined && answers !== null) {
            answers.forEach((a: Answer) => {
              a.formSubmissionId = result[i].id;
              a.churchId = churchId;
              answerPromises.push(this.repositories.answer.save(a));
            });
          }
        }
        if (answerPromises.length > 0) await Promise.all(answerPromises);
        // Send email to form members that have emailNotification set to true
        if (sendEmail === true) {
          const memberPermissions = await this.repositories.memberPermission.loadByEmailNotification(churchId, true);
          if (memberPermissions.length > 0) {
            const Ids: string[] = [];
            memberPermissions.forEach((mp: MemberPermission) => Ids.push(mp.memberId));
            const people = await this.repositories.person.loadByIds(churchId, Ids);
            const contentRows: any[] = [];
            result.forEach((r) => {
              r.questions.forEach((q) => {
                r.answers.forEach((a) => {
                  if (q.id === a.questionId) {
                    contentRows.push(
                      `<tr><th style="font-size: 16px" width="30%">` + q.title + `</th><td style="font-size: 15px">` + a.value + `</td></tr>`
                    )
                  }
                })
              })
            })
            const contents = `<table role="presentation" style="text-align: left;" cellspacing="8" width="80%"><tablebody>` + contentRows.join(" ") + `</tablebody></table>`
            people.forEach((p: Person) => {
              return EmailHelper.sendTemplatedEmail(Environment.supportEmail, p.email, "Live Church Solutions", Environment.chumsRoot, "New Submissions for " + formName, contents)
            })
          }
        }
        return this.repositories.formSubmission.convertAllToModel(churchId, result);
      }
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.forms.admin) || !au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
      else {
        await this.repositories.answer.deleteForSubmission(au.churchId, id);
        await new Promise(resolve => setTimeout(resolve, 500)); // I think it takes a split second for the FK restraints to see the answers were deleted sometimes and the delete below fails.
        await this.repositories.formSubmission.delete(au.churchId, id);
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
