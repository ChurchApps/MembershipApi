import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { MemberPermission } from "../models"
import { Permissions } from '../helpers/Permissions'

@controller("/memberpermissions")
export class MemberPermissionController extends MembershipBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.view)) return this.json({}, 401);
            else return this.repositories.memberPermission.convertToModel(au.churchId, await this.repositories.memberPermission.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.view)) return this.json({}, 401);
            else {
                return this.repositories.memberPermission.convertAllToModel(au.churchId, await this.repositories.memberPermission.loadAll(au.churchId));
            }
        });
    }

    @httpGet("/form/:id")
    public async getByForm(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.view)) return this.json({}, 401);
            else return this.repositories.memberPermission.convertAllToModel(au.churchId, await this.repositories.memberPermission.loadPeopleByForm(au.churchId, id));
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, MemberPermission[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
            else {
                const promises: Promise<MemberPermission>[] = [];
                req.body.forEach((memberPermission: MemberPermission) => {
                    memberPermission.churchId = au.churchId;
                    promises.push(this.repositories.memberPermission.save(memberPermission));
                });
                const result = await Promise.all(promises);
                return this.repositories.memberPermission.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
            else await this.repositories.memberPermission.delete(au.churchId, id);
        });
    }

    @httpDelete("/member/:id")
    public async deleteByMemberId(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.forms.edit)) return this.json({}, 401);
            else await this.repositories.memberPermission.deleteByMemberId(au.churchId, id);
        });
    }
}
