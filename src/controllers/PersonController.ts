import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { Person, Household } from "../models"
import { FormSubmission, Form } from "../apiBase/models"
import { AwsHelper } from "../helpers"
import { RoleContentType, RoleAction } from '../constants'
import { Permissions } from '../helpers/Permissions'


@controller("/people")
export class PersonController extends MembershipBaseController {

    @httpGet("/recent")
    public async getRecent(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.loadRecent(au.churchId);
            return this.repositories.person.convertAllToModel(au.churchId, data);
        });
    }

    @httpGet("/household/:householdId")
    public async getHouseholdMembers(@requestParam("householdId") householdId: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return this.repositories.person.convertAllToModel(au.churchId, await this.repositories.person.loadByHousehold(au.churchId, householdId));
        });
    }


    @httpPost("/household/:householdId")
    public async saveMembers(@requestParam("householdId") householdId: number, req: express.Request<{}, {}, Person[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.households.edit)) return this.json({}, 401);
            else {
                // save submitted
                const promises: Promise<Person>[] = [];
                req.body.forEach(person => { person.churchId = au.churchId; promises.push(this.repositories.person.updateHousehold(person)); });
                const result = await Promise.all(promises);

                // remove missing
                const removePromises: Promise<any>[] = [];
                const dbPeople = await this.repositories.person.loadByHousehold(au.churchId, householdId);
                dbPeople.forEach((dbPerson: Person) => {
                    let match = false;
                    req.body.forEach(person => { if (person.id === dbPerson.id) match = true; })
                    if (!match) {
                        const p = this.repositories.person.convertToModel(au.churchId, dbPerson);
                        p.churchId = au.churchId;
                        removePromises.push(this.removeFromHousehold(p));
                    }
                });
                if (removePromises.length > 0) await Promise.all(removePromises);
                this.repositories.household.deleteUnused(au.churchId);
                return this.repositories.person.convertAllToModel(au.churchId, result);
            }
        });
    }

    private async removeFromHousehold(person: Person) {
        const household: Household = { churchId: person.churchId, name: person.name.last };
        return this.repositories.household.save(household).then(async h => {
            person.householdId = h.id;
            person.householdRole = "Head";
            await this.repositories.person.updateHousehold(person);
        });
    }

    @httpGet("/userids")
    public async getByUserIds(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const userIdList = req.query.userIds.toString().split(',');
            const userIds: number[] = [];
            userIdList.forEach(userId => userIds.push(parseInt(userId, 0)));
            const data = await this.repositories.person.loadByUserIds(au.churchId, userIds);
            return this.repositories.person.convertAllToModel(au.churchId, data);
        });
    }

    @httpGet("/attendance")
    public async loadAttendees(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
            else {
                const campusId = (req.query.campusId === undefined) ? 0 : parseInt(req.query.campusId.toString(), 0);
                const serviceId = (req.query.serviceId === undefined) ? 0 : parseInt(req.query.serviceId.toString(), 0);
                const serviceTimeId = (req.query.serviceTimeId === undefined) ? 0 : parseInt(req.query.serviceTimeId.toString(), 0);
                const groupId = (req.query.groupId === undefined) ? 0 : parseInt(req.query.groupId.toString(), 0);
                const categoryName = (req.query.categoryName === undefined) ? "" : req.query.categoryName.toString();
                const startDate = (req.query.startDate === undefined) ? null : new Date(req.query.startDate.toString());
                const endDate = (req.query.endDate === undefined) ? null : new Date(req.query.endDate.toString());
                const data = await this.repositories.person.loadAttendees(au.churchId, campusId, serviceId, serviceTimeId, categoryName, groupId, startDate, endDate);
                return this.repositories.person.convertAllToModel(au.churchId, data);
            }
        });
    }

    @httpGet("/search/phone")
    public async searchPhone(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const phoneNumber: string = req.query.number.toString();
            const data = await this.repositories.person.searchPhone(au.churchId, phoneNumber);
            return this.repositories.person.convertAllToModel(au.churchId, data);
        });
    }

    @httpGet("/search")
    public async search(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            let data = null;
            const email: string = req.query.email?.toString();
            console.log(email);
            if (email) data = await this.repositories.person.searchEmail(au.churchId, email);
            else {
                let term: string = req.query.term.toString();
                if (term === null) term = "";
                data = await this.repositories.person.search(au.churchId, term);
            }
            console.log(JSON.stringify(data));
            return this.repositories.person.convertAllToModel(au.churchId, data);
        });
    }

    @httpGet("/ids")
    public async getMultiple(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const idList = req.query.ids.toString().split(',');
            const ids: number[] = [];
            idList.forEach(id => ids.push(parseInt(id, 0)));
            const data = await this.repositories.person.loadByIds(au.churchId, ids);
            const result = this.repositories.person.convertAllToModel(au.churchId, data)
            return result;
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.load(au.churchId, id);
            const result = this.repositories.person.convertToModel(au.churchId, data)
            await this.appendFormSubmissions(au.churchId, result);
            return result;
        });
    }

    @httpPost("/:id/claim")
    public async claim(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.load(au.churchId, id);
            const person = this.repositories.person.convertToModel(au.churchId, data)
            if (person.contactInfo.email === au.email) {
                person.userId = au.id;
                await this.repositories.person.save(person);
                return person;
            } else return this.json({}, 401);
        });
    }

    @httpGet("/userid/:userId")
    public async getByUserId(@requestParam("userId") userId: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.loadByUserId(au.churchId, userId);
            return this.repositories.person.convertToModel(au.churchId, data);
        });
    }


    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.loadAll(au.churchId);
            return this.repositories.person.convertAllToModel(au.churchId, data);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Person[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
            else {
                const promises: Promise<Person>[] = [];
                req.body.forEach(person => {
                    person.churchId = au.churchId;
                    if (person.contactInfo === undefined) person.contactInfo = {};
                    promises.push(
                        this.repositories.person.save(person).then(async (p) => {
                            // const r = this.repositories.person.convertToModel(au.churchId, p);
                            p.churchId = au.churchId;
                            if (p.photo !== undefined && p.photo.startsWith("data:image/png;base64,")) await this.savePhoto(au.churchId, p);
                            return p;
                        })
                    );
                });
                return this.repositories.person.convertAllToModel(au.churchId, await Promise.all(promises));
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
            else await this.repositories.person.delete(au.churchId, id);
        });
    }


    private async savePhoto(churchId: number, person: Person) {
        // console.log("SAVE PHOTO");
        const base64 = person.photo.split(',')[1];
        const key = "content/c/" + churchId + "/p/" + person.id + ".png";
        return AwsHelper.S3Upload(key, "image/png", Buffer.from(base64, 'base64')).then(async () => {
            person.photoUpdated = new Date();
            person.photo = "/" + key + "?dt=" + person.photoUpdated.getTime().toString();
            await this.repositories.person.save(person);
        });
    }

    private async appendFormSubmissions(churchId: number, person: Person) {
        const submissions: FormSubmission[] = this.baseRepositories.formSubmission.convertAllToModel(churchId, await this.baseRepositories.formSubmission.loadForContent(churchId, "person", person.id));
        if (submissions.length > 0) {
            const formIds: number[] = [];
            submissions.forEach(s => { if (formIds.indexOf(s.formId) === -1) formIds.push(s.formId) });
            const forms: Form[] = this.baseRepositories.form.convertAllToModel(churchId, await this.baseRepositories.form.loadByIds(churchId, formIds));

            person.formSubmissions = [];
            submissions.forEach(s => {
                forms.forEach(f => { if (f.id === s.formId) s.form = f; });
                if (s.form !== undefined) person.formSubmissions.push(s);
            })
        }
    }


}
