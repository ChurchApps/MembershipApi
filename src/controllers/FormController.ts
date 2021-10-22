import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete, results } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { Form } from "../apiBase/models";
import { Permissions } from "../helpers";
import { MemberPermission } from "../models";

@controller("/forms")
export class FormController extends MembershipBaseController {

    @httpGet("/archived")
    public async getArchived(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (au.checkAccess(Permissions.forms.admin)) return this.repositories.form.convertAllToModel(au.churchId, await this.repositories.form.loadAllArchived(au.churchId));
            else {
                const memberForms = await this.repositories.form.convertAllToModel(au.churchId, await this.repositories.form.loadMemberArchivedForms(au.churchId, au.personId));
                const nonMemberForms = au.checkAccess(Permissions.forms.access) ? await this.repositories.form.convertAllToModel(au.churchId, await this.repositories.form.loadNonMemberArchivedForms(au.churchId)) : [];
                return [...memberForms, ...nonMemberForms];
            }
        });
    }

    @httpGet("/standalone/:id")
    public async getStandAlone(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const churchId = req?.query?.churchId.toString();
            const form = this.repositories.form.convertToModel("", await this.repositories.form.load(churchId, id));
            if (form.contentType !== "form" || (!au.id && form.restricted)) return this.json({restricted: true}, 401);
            else return form;
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!this.formAccess(au, id, "view")) return this.json({}, 401);
            else return await this.repositories.form.convertToModel(au.churchId, await this.repositories.form.load(au.churchId, id));
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (au.checkAccess(Permissions.forms.admin)) return this.repositories.form.convertAllToModel(au.churchId, await this.repositories.form.loadAll(au.churchId));
            else {
                const memberForms = await this.repositories.form.convertAllToModel(au.churchId, await this.repositories.form.loadMemberForms(au.churchId, au.personId));
                const nonMemberForms = au.checkAccess(Permissions.forms.access) ? await this.repositories.form.convertAllToModel(au.churchId, await this.repositories.form.loadNonMemberForms(au.churchId)) : [];
                return [...memberForms, ...nonMemberForms];
            }
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Form[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const formPromises: Promise<Form>[] = [];
            const newStandAloneFormPromises: Promise<Form>[] = [];
            const memberPermissionPromises: Promise<MemberPermission>[] = [];
            req.body.forEach(form => {
                if (this.formAccess(au, form.id)) {
                    form.churchId = au.churchId;
                    if (!form.id && form.contentType === "form") newStandAloneFormPromises.push(this.repositories.form.save(form));
                    else formPromises.push(this.repositories.form.save(form));
                }
            });
            const formResult = await this.repositories.form.convertAllToModel(au.churchId, await Promise.all(formPromises));
            const newStandAloneFormResult = await this.repositories.form.convertAllToModel(au.churchId, await Promise.all(newStandAloneFormPromises));
            newStandAloneFormResult.forEach(form => {
                const memberPermission = { churchId: au.churchId, memberId: au.personId, contentType: form.contentType, contentId: form.id, action: "admin" };
                memberPermissionPromises.push(this.repositories.memberPermission.save(memberPermission));
            });
            await Promise.all(memberPermissionPromises);
            return [...formResult, newStandAloneFormResult];
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!this.formAccess(au, id)) return this.json({}, 401);
            else await this.repositories.form.delete(au.churchId, id);
        });
    }

}
