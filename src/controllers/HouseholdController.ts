import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { Household } from "../models"
import { Permissions } from '../helpers/Permissions'

@controller("/households")
export class HouseholdController extends MembershipBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return this.repositories.household.convertToModel(au.churchId, await this.repositories.household.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return this.repositories.household.convertAllToModel(au.churchId, await this.repositories.household.loadAll(au.churchId));
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Household[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.households.edit)) return this.json({}, 401);
            else {
                const promises: Promise<Household>[] = [];
                req.body.forEach(household => { household.churchId = au.churchId; promises.push(this.repositories.household.save(household)); });
                const result = await Promise.all(promises);
                return this.repositories.household.convertAllToModel(au.churchId, result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.households.edit)) return this.json({}, 401);
            else await this.repositories.household.delete(au.churchId, id);
        });
    }

}
