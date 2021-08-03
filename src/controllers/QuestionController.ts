import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { Question } from "../apiBase/models"
import { Permissions } from "../helpers";

@controller("/questions")
export class QuestionController extends MembershipBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.view)) return this.json({}, 401);
            else return this.repositories.question.convertToModel(au.churchId, await this.repositories.question.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.view)) return this.json({}, 401);
            else {
                let data = null;
                if (req.query.formId !== undefined) data = await this.repositories.question.loadForForm(au.churchId, req.query.formId.toString());
                else data = await this.repositories.question.loadAll(au.churchId);
                return this.repositories.question.convertAllToModel(au.churchId, data);
            }
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Question[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
            else {
                const promises: Promise<Question>[] = [];
                req.body.forEach(question => { question.churchId = au.churchId; promises.push(this.repositories.question.save(question)); });
                const result = await Promise.all(promises);
                return this.repositories.question.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
            else await this.repositories.question.delete(au.churchId, id);
        });
    }

}
