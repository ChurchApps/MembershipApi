import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { Question } from "../models"

@controller("/questions")
export class QuestionController extends MembershipBaseController {

    @httpGet("/sort/:id/up")
    public async moveQuestionUp(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.question.moveQuestionUp(id);
        });
    }

    @httpGet("/sort/:id/down")
    public async moveQuestionDown(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return await this.repositories.question.moveQuestionDown(id);
        });
    }

    @httpGet("/unrestricted")
    public async getUnrestricted(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const formId = req?.query?.formId?.toString() || null;
            if (!formId) return this.json({}, 401);
            else return this.repositories.question.convertAllToModel("", await this.repositories.question.loadForUnrestrictedForm(formId));
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const formId = req?.query?.formId?.toString() || null;
            if (!this.formAccess(au, formId, "view")) return this.json({}, 401);
            else return this.repositories.question.convertToModel(au.churchId, await this.repositories.question.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const formId = req?.query?.formId?.toString() || null;
            if (!this.formAccess(au, formId, "view")) return this.json({}, 401);
            else return this.repositories.question.convertAllToModel(au.churchId, await this.repositories.question.loadForForm(au.churchId, formId));
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Question[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const promises: Promise<Question>[] = [];
            req.body.forEach(question => {
                if (this.formAccess(au, question.formId)) {
                    question.churchId = au.churchId;
                    promises.push(this.repositories.question.save(question));
                }
            });
            const result = await Promise.all(promises);
            return this.repositories.question.convertAllToModel(au.churchId, result);
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const formId = req?.query?.formId?.toString() || null;
            if (!this.formAccess(au, formId)) return this.json({}, 401);
            else await this.repositories.question.delete(au.churchId, id);
        });
    }

}
