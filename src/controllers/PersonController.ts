import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { Person, Household } from "../models"
import { FormSubmission, Form } from "../apiBase/models"
import { FileHelper } from "../helpers"
import { Permissions } from '../helpers/Permissions'
import { AuthenticatedUser } from "../apiBase/auth";


@controller("/people")
export class PersonController extends MembershipBaseController {

    @httpGet("/recent")
    public async getRecent(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.view) && !au.checkAccess(Permissions.people.viewMembers)) return this.json({}, 401);
            else {
                const data = await this.repositories.person.loadRecent(au.churchId);
                const result = this.repositories.person.convertAllToModel(au.churchId, data);
                return this.filterPeople(result, au);
            }
        });
    }

    @httpGet("/household/:householdId")
    public async getHouseholdMembers(@requestParam("householdId") householdId: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            return this.repositories.person.convertAllToModel(au.churchId, await this.repositories.person.loadByHousehold(au.churchId, householdId));
        });
    }


    @httpPost("/household/:householdId")
    public async saveMembers(@requestParam("householdId") householdId: string, req: express.Request<{}, {}, Person[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
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

    @httpGet("/attendance")
    public async loadAttendees(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
            else {
                const campusId = (req.query.campusId === undefined) ? "" : req.query.campusId.toString();
                const serviceId = (req.query.serviceId === undefined) ? "" : req.query.serviceId.toString();
                const serviceTimeId = (req.query.serviceTimeId === undefined) ? "" : req.query.serviceTimeId.toString();
                const groupId = (req.query.groupId === undefined) ? "" : req.query.groupId.toString();
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
            if (!au.checkAccess(Permissions.people.view) && !au.checkAccess(Permissions.people.viewMembers)) return this.json({}, 401);
            else {
                const phoneNumber: string = req.query.number.toString();
                const data = await this.repositories.person.searchPhone(au.churchId, phoneNumber);
                const result = this.repositories.person.convertAllToModel(au.churchId, data);
                return this.filterPeople(result, au);
            }
        });
    }

    @httpGet("/search")
    public async search(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.view) && !au.checkAccess(Permissions.people.viewMembers)) return this.json({}, 401);
            else {
                let data = null;
                const email: string = req.query.email?.toString();
                if (email) data = await this.repositories.person.searchEmail(au.churchId, email);
                else {
                    let term: string = req.query.term.toString();
                    if (term === null) term = "";
                    data = await this.repositories.person.search(au.churchId, term);
                }
                const result = this.repositories.person.convertAllToModel(au.churchId, data);
                return this.filterPeople(result, au);
            }
        });
    }

    @httpGet("/ids")
    public async getMultiple(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.view) && !au.checkAccess(Permissions.people.viewMembers)) return this.json({}, 401);
            else {
                const idList = req.query.ids.toString().split(',');
                const ids: string[] = [];
                idList.forEach(id => ids.push(id));
                const data = await this.repositories.person.loadByIds(au.churchId, ids);
                const result = this.repositories.person.convertAllToModel(au.churchId, data)
                return this.filterPeople(result, au);
            }
        });
    }

    @httpGet("/:id")
    public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.view) && !au.checkAccess(Permissions.people.viewMembers)) return this.json({}, 401);
            else {
                const data = await this.repositories.person.load(au.churchId, id);
                const result = this.repositories.person.convertToModel(au.churchId, data)
                await this.appendFormSubmissions(au.churchId, result);
                return result;
            }
        });
    }

    @httpPost("/:id/claim")
    public async claim(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            const data = await this.repositories.person.load(au.churchId, id);
            const person = this.repositories.person.convertToModel(au.churchId, data)
            if (person.contactInfo.email === au.email) {
                // TODO: enable what this does with the new flow
                // person.userId = au.id;
                await this.repositories.person.save(person);
                return person;
            } else return this.json({}, 401);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.view) && !au.checkAccess(Permissions.people.viewMembers)) return this.json({}, 401);
            else {
                const data = await this.repositories.person.loadAll(au.churchId);
                const result = this.repositories.person.convertAllToModel(au.churchId, data);
                return this.filterPeople(result, au);
            }
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Person[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            // TODO - get the commented permission check working
            // let isSelfPermissionValid: boolean = false;
            // if (au.checkAccess(Permissions.people.editSelf)) {
            //     isSelfPermissionValid = req.body[0].userId === au.id;
            // }
            // if (!au.checkAccess(Permissions.people.edit) && !isSelfPermissionValid) return this.json({}, 401);
            if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401)
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
    public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
            else await this.repositories.person.delete(au.churchId, id);
        });
    }


    private async savePhoto(churchId: string, person: Person) {
        // console.log("SAVE PHOTO");
        const base64 = person.photo.split(',')[1];
        const key = "/" + churchId + "/membership/people/" + person.id + ".png";
        return FileHelper.store(key, "image/png", Buffer.from(base64, 'base64')).then(async () => {
            person.photoUpdated = new Date();
            person.photo = key + "?dt=" + person.photoUpdated.getTime().toString();
            await this.repositories.person.save(person);
        });
    }

    private async appendFormSubmissions(churchId: string, person: Person) {
        const submissions: FormSubmission[] = this.baseRepositories.formSubmission.convertAllToModel(churchId, await this.baseRepositories.formSubmission.loadForContent(churchId, "person", person.id));
        if (submissions.length > 0) {
            const formIds: string[] = [];
            submissions.forEach(s => { if (formIds.indexOf(s.formId) === -1) formIds.push(s.formId) });
            const forms: Form[] = this.baseRepositories.form.convertAllToModel(churchId, await this.baseRepositories.form.loadByIds(churchId, formIds));

            person.formSubmissions = [];
            submissions.forEach(s => {
                forms.forEach(f => { if (f.id === s.formId) s.form = f; });
                if (s.form !== undefined) person.formSubmissions.push(s);
            })
        }
    }

    private filterPeople(people: Person[], au: AuthenticatedUser) {
        if (au.checkAccess(Permissions.people.view)) return people;
        else {
            const result: Person[] = [];
            people.forEach(p => { if (p.membershipStatus === "member") result.push(p) });
            return result;
        }
    }


}
