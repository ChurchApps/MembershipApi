import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { GroupMember } from "../models"
import { Permissions } from '../helpers/Permissions'

@controller("/groupmembers")
export class GroupMemberController extends MembershipBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.groupMembers.view)) return this.json({}, 401);
            else return this.repositories.groupMember.convertToModel(au.churchId, await this.repositories.groupMember.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.groupMembers.view)) return this.json({}, 401);
            else {
                let result = null;
                if (req.query.groupId !== undefined) result = await this.repositories.groupMember.loadForGroup(au.churchId, req.query.groupId.toString());
                else if (req.query.personId !== undefined) result = await this.repositories.groupMember.loadForPerson(au.churchId, req.query.personId.toString());
                else result = await this.repositories.groupMember.loadAll(au.churchId);
                return this.repositories.groupMember.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, GroupMember[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.groupMembers.edit)) return this.json({}, 401);
            else {
                const promises: Promise<GroupMember>[] = [];
                req.body.forEach(groupmember => { groupmember.churchId = au.churchId; promises.push(this.repositories.groupMember.save(groupmember)); });
                const result = await Promise.all(promises);
                return this.repositories.groupMember.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.groupMembers.edit)) return this.json({}, 401);
            else await this.repositories.groupMember.delete(au.churchId, id);
        });
    }


}
