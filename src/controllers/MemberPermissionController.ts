import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { MemberPermission } from "../models"

@controller("/memberpermissions")
export class MemberPermissionController extends MembershipBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!this.formAccess(au, id, "view")) return this.json({}, 401);
            else return this.repositories.memberPermission.convertToModel(au.churchId, await this.repositories.memberPermission.load(au.churchId, id));
        });
    }

    @httpGet("/form/:id")
    public async getByForm(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!this.formAccess(au, id)) return this.json({}, 401);
            else return this.repositories.memberPermission.convertAllToModel(au.churchId, await this.repositories.memberPermission.loadPeopleByForm(au.churchId, id));
        });
    }

    @httpGet("/form/:id/my")
    public async getMyPermissions(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!this.formAccess(au, id)) return this.json({}, 401);
            else return this.repositories.memberPermission.convertToModel(au.churchId, await this.repositories.memberPermission.loadMyByForm(au.churchId, id, au.personId));
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, MemberPermission[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const promises: Promise<MemberPermission>[] = [];
            req.body.forEach((memberPermission: MemberPermission) => {
                if (this.formAccess(au, memberPermission.contentId))  {
                    memberPermission.churchId = au.churchId;
                    promises.push(this.repositories.memberPermission.save(memberPermission));
                }
            });
            const result = await Promise.all(promises);
            return this.repositories.memberPermission.convertAllToModel(au.churchId, result);
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const formId = req?.query?.formId.toString();
            if (!this.formAccess(au, formId)) return this.json({}, 401);
            else await this.repositories.memberPermission.delete(au.churchId, id);
        });
    }

    @httpDelete("/member/:id")
    public async deleteByMemberId(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const formId = req?.query?.formId.toString();
            if (!formId || !this.formAccess(au, formId)) return this.json({}, 401);
            else await this.repositories.memberPermission.deleteByMemberId(au.churchId, id, formId);
        });
    }
}
