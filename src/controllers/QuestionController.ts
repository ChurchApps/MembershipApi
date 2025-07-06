import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { Question } from "../models";

@controller("/questions")
export class QuestionController extends MembershipBaseController {
  @httpGet("/sort/:id/up")
  public async moveQuestionUp(
    @requestParam("id") id: string,
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.question.moveQuestionUp(id);
    });
  }

  @httpGet("/sort/:id/down")
  public async moveQuestionDown(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.question.moveQuestionDown(id);
    });
  }

  @httpGet("/unrestricted")
  public async getUnrestricted(req: express.Request<{}, {}, null>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const formId = req?.query?.formId?.toString() || null;
      if (!formId) return this.json({}, 401);
      else
        return this.repositories.question.convertAllToModel(
          "",
          (await this.repositories.question.loadForUnrestrictedForm(formId)) as any[]
        );
    });
  }

  @httpGet("/:id")
  public async get(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const formId = req?.query?.formId?.toString() || null;
      if (!this.formAccess(au, formId, "view")) return this.json({}, 401);
      else
        return this.repositories.question.convertToModel(
          au.churchId,
          await this.repositories.question.load(au.churchId, id)
        );
    });
  }

  @httpGet("/")
  public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const formId = req?.query?.formId?.toString() || null;
      if (!this.formAccess(au, formId, "view")) return this.json({}, 401);
      else
        return this.repositories.question.convertAllToModel(
          au.churchId,
          (await this.repositories.question.loadForForm(au.churchId, formId)) as any[]
        );
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Question[]>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const promises: Promise<Question>[] = [];
      const questions = req.body;
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (this.formAccess(au, question.formId)) {
          const availableQuestions = (await this.repositories.question.loadForForm(
            au.churchId,
            question.formId
          )) as any[];
          const maxValue = Math.max(...(availableQuestions as any[]).map((q: any) => q.sort));
          const addBy = i + 1;
          const sort = availableQuestions.length > 0 ? maxValue + addBy : 1;
          question.churchId = au.churchId;
          question.sort = question.sort ? question.sort : sort.toString();
          promises.push(this.repositories.question.save(question));
        }
      }
      const result = await Promise.all(promises);
      return this.repositories.question.convertAllToModel(au.churchId, result);
    });
  }

  @httpDelete("/:id")
  public async delete(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const formId = req?.query?.formId?.toString() || null;
      if (!this.formAccess(au, formId)) return this.json({}, 401);
      else {
        await this.repositories.question.delete(au.churchId, id);
        return this.json({});
      }
    });
  }
}
