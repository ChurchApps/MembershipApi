import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { Person, Household, SearchCondition, Group, VisibilityPreference } from "../models";
import { FormSubmission, Form } from "../models";
import { ArrayHelper, Environment, FileStorageHelper, PersonHelper } from "../helpers";
import { Permissions } from "../helpers/Permissions";
import { AuthenticatedUser, EmailHelper } from "@churchapps/apihelper";

@controller("/people")
export class PersonController extends MembershipBaseController {
  @httpPost("/apiEmails")
  public async apiEmails(
    req: express.Request<{}, {}, any>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      const jwtSecret = req.body.jwtSecret;
      const peopleIds = req.body.peopleIds;
      if (jwtSecret !== Environment.jwtSecret) return this.denyAccess(["Invalid JWT Secret"]);
      else {
        const people: any[] = await this.repositories.person.loadByIdsOnly(peopleIds);
        const result: any[] = [];
        people.forEach((p) => {
          result.push({ id: p.id, email: p.email });
        });
        return result;
      }
    });
  }

  @httpPost("/public/email")
  public async publicEmail(
    req: express.Request<{}, {}, any>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      const churchId = req.body.churchId;
      const personId = req.body.personId;
      const subject = req.body.subject;
      const body = req.body.body;
      const appName = req.body.appName;

      const person: Person = await this.repositories.person.load(churchId, personId);
      if (!person?.email) return this.denyAccess(["No email address"]);

      await EmailHelper.sendTemplatedEmail(Environment.supportEmail, person.email, appName, null, subject, body);
      return { success: true };
    });
  }

  @httpGet("/timeline")
  public async timeline(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const result: { people: Person[]; groups: Group[] } = { people: [], groups: [] };
      const peopleIds: string[] = req.query.personIds ? req.query.personIds.toString().split(",") : [];
      const groupIds: string[] = req.query.groupIds ? req.query.groupIds.toString().split(",") : [];
      if (peopleIds.length > 0) {
        const tmpPeople = await this.repositories.person.loadByIds(au.churchId, peopleIds);
        result.people = this.repositories.person.convertAllToModel(
          au.churchId,
          tmpPeople,
          au.checkAccess(Permissions.people.edit)
        );
      }
      if (groupIds.length > 0) result.groups = await this.repositories.group.loadByIds(au.churchId, groupIds);
      return result;
    });
  }

  @httpGet("/claim/:churchId")
  public async claim(
    @requestParam("churchId") churchId: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return PersonHelper.claim(au, churchId);
    });
  }

  @httpGet("/recent")
  public async getRecent(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        const filterOptedOut = au.checkAccess(Permissions.server.admin) ? false : true;
        const data = await this.repositories.person.loadRecent(au.churchId, filterOptedOut);
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpGet("/household/:householdId")
  public async getHouseholdMembers(
    @requestParam("householdId") householdId: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return this.repositories.person.convertAllToModel(
        au.churchId,
        await this.repositories.person.loadByHousehold(au.churchId, householdId),
        au.checkAccess(Permissions.people.edit)
      );
    });
  }

  @httpPost("/loadOrCreate")
  public async loadOrCreate(
    req: express.Request<{}, {}, any>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      const { churchId, email, firstName, lastName } = req.body;
      const person: Person = await PersonHelper.getPerson(churchId, email, firstName, lastName, false);
      return { id: person.id, name: person.name, contactInfo: person.contactInfo };
    });
  }

  @httpPost("/household/:householdId")
  public async saveMembers(
    @requestParam("householdId") householdId: string,
    req: express.Request<{}, {}, Person[]>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
      else {
        // save submitted
        const promises: Promise<Person>[] = [];
        req.body.forEach((person) => {
          person.churchId = au.churchId;
          promises.push(this.repositories.person.updateHousehold(person));
        });
        const result = await Promise.all(promises);

        // remove missing
        const removePromises: Promise<any>[] = [];
        const dbPeople = await this.repositories.person.loadByHousehold(au.churchId, householdId);
        dbPeople.forEach((dbPerson: Person) => {
          let match = false;
          req.body.forEach((person) => {
            if (person.id === dbPerson.id) match = true;
          });
          if (!match) {
            const p = this.repositories.person.convertToModel(
              au.churchId,
              dbPerson,
              au.checkAccess(Permissions.people.edit)
            );
            p.churchId = au.churchId;
            removePromises.push(this.removeFromHousehold(p));
          }
        });
        if (removePromises.length > 0) await Promise.all(removePromises);
        this.repositories.household.deleteUnused(au.churchId);
        return this.repositories.person.convertAllToModel(au.churchId, result, au.checkAccess(Permissions.people.edit));
      }
    });
  }

  private async removeFromHousehold(person: Person) {
    const household: Household = { churchId: person.churchId, name: person.name.last };
    return this.repositories.household.save(household).then(async (h) => {
      person.householdId = h.id;
      person.householdRole = "Head";
      await this.repositories.person.updateHousehold(person);
    });
  }

  @httpGet("/attendance")
  public async loadAttendees(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
      else {
        const campusId = req.query.campusId === undefined ? "" : req.query.campusId.toString();
        const serviceId = req.query.serviceId === undefined ? "" : req.query.serviceId.toString();
        const serviceTimeId = req.query.serviceTimeId === undefined ? "" : req.query.serviceTimeId.toString();
        const groupId = req.query.groupId === undefined ? "" : req.query.groupId.toString();
        const categoryName = req.query.categoryName === undefined ? "" : req.query.categoryName.toString();
        const startDate = req.query.startDate === undefined ? null : new Date(req.query.startDate.toString());
        const endDate = req.query.endDate === undefined ? null : new Date(req.query.endDate.toString());
        const data = await this.repositories.person.loadAttendees(
          au.churchId,
          campusId,
          serviceId,
          serviceTimeId,
          categoryName,
          groupId,
          startDate,
          endDate
        );
        return this.repositories.person.convertAllToModel(au.churchId, data, au.checkAccess(Permissions.people.edit));
      }
    });
  }

  @httpGet("/search/phone")
  public async searchPhone(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        const phoneNumber: string = req.query.number.toString();
        const data = await this.repositories.person.searchPhone(au.churchId, phoneNumber);
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpGet("/search/group")
  public async searchGroup(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        let data: any[] = [];
        const members = await this.repositories.groupMember.loadForGroup(au.churchId, req.query.groupId.toString());
        if (members.length === 0) {
          return data;
        }
        const peopleIds = ArrayHelper.getIds(members, "personId");
        data = await this.repositories.person.loadByIds(au.churchId, peopleIds);
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpGet("/search")
  public async search(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        let data = null;
        const email: string = req.query.email?.toString();
        if (email) data = await this.repositories.person.searchEmail(au.churchId, email);
        else {
          let term: string = req.query.term.toString();
          if (term === null) term = "";
          const filterOptedOut = au.checkAccess(Permissions.server.admin) ? false : true;
          data = await this.repositories.person.search(au.churchId, term, filterOptedOut);
        }
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpGet("/basic")
  public async getBasic(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const idList = req.query.ids.toString().split(",");
      const ids: string[] = [];
      idList.forEach((id) => ids.push(id));
      const data = await this.repositories.person.loadByIds(au.churchId, ids);
      const result = this.repositories.person.convertAllToBasicModel(au.churchId, data);
      return this.filterPeople(result, au);
    });
  }

  @httpGet("/directory/:id")
  public async getDirectoryPeople(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (au.personId !== id && !au.checkAccess(Permissions.people.view)) {
        if (id === "all") {
          return this.repositories.person.convertAllToBasicModel(
            au.churchId,
            await this.repositories.person.loadAll(au.churchId)
          );
        } else {
          const data = await this.repositories.person.load(au.churchId, id);
          if (!data) return null;
          const result = this.repositories.person.convertToModel(au.churchId, data, false);
          return this.repositories.person.convertToPreferenceModel(
            au.churchId,
            await this.checkVisibilityPref(id, au, result)
          );
          // return result;
        }
      } else {
        if (id === "all") {
          return this.repositories.person.convertAllToModel(
            au.churchId,
            await this.repositories.person.loadAll(au.churchId),
            false
          );
        } else {
          const data = await this.repositories.person.load(au.churchId, id);
          if (!data) return null;
          const result = this.repositories.person.convertToModel(
            au.churchId,
            data,
            au.checkAccess(Permissions.people.edit)
          );
          await this.appendFormSubmissions(au.churchId, result);
          return result;
        }
      }
    });
  }

  @httpGet("/ids")
  public async getMultiple(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        const idList = req.query.ids.toString().split(",");
        const ids: string[] = [];
        idList.forEach((id) => ids.push(id));
        const data = await this.repositories.person.loadByIds(au.churchId, ids);
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpGet("/:id")
  public async get(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (au.personId !== id && !au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        const data = await this.repositories.person.load(au.churchId, id);
        if (!data) return null;
        const result = this.repositories.person.convertToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        await this.appendFormSubmissions(au.churchId, result);
        return result;
      }
    });
  }

  @httpGet("/")
  public async getAll(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        const data = au.checkAccess(Permissions.people.view)
          ? await this.repositories.person.loadAll(au.churchId)
          : await this.repositories.person.loadMembers(au.churchId);
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpPost("/search")
  public async searchPost(
    req: express.Request<{}, {}, { email?: string; term?: string }>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        let data = null;
        const email: string = req.body.email?.toString();
        if (email) data = await this.repositories.person.searchEmail(au.churchId, email);
        else {
          let term: string = req.body.term.toString();
          if (term === null) term = "";
          data = await this.repositories.person.search(au.churchId, term);
        }
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpPost("/advancedSearch")
  public async advancedSearch(
    req: express.Request<{}, {}, SearchCondition[]>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.view) && !(await this.isMember(au.membershipStatus)))
        return this.json({}, 401);
      else {
        let data: any[] = await this.repositories.person.loadAll(au.churchId);
        req.body.forEach((c) => {
          switch (c.field) {
            case "age":
              data.forEach((p) => {
                p.age = PersonHelper.getAge(p.birthDate);
              });
              data = ArrayHelper.getAllOperator(data, "age", c.value, c.operator, "number");
              break;
            case "yearsMarried":
              data.forEach((p) => {
                p.yearsMarried = PersonHelper.getAge(p.anniversaryDate);
              });
              data = ArrayHelper.getAllOperator(data, "yearsMarried", c.value, c.operator, "number");
              break;
            case "birthMonth":
              data.forEach((p) => {
                p.birthMonth = PersonHelper.getBirthMonth(p.birthDate);
              });
              data = ArrayHelper.getAllOperator(data, "birthMonth", c.value, c.operator, "number");
              break;
            case "anniversaryMonth":
              data.forEach((p) => {
                p.anniversaryMonth = PersonHelper.getBirthMonth(p.anniversaryDate);
              });
              data = ArrayHelper.getAllOperator(data, "anniversaryMonth", c.value, c.operator, "number");
              break;
            case "phone":
              data = ArrayHelper.getAllOperator(data, "homePhone", c.value, c.operator)
                .concat(ArrayHelper.getAllOperator(data, "workPhone", c.value, c.operator))
                .concat(ArrayHelper.getAllOperator(data, "cellPhone", c.value, c.operator));
              data = ArrayHelper.getUnique(data);
              break;
            case "id":
              data = ArrayHelper.getAllOperatorArray(data, c.field, c.value.split(","), c.operator);
              break;
            default:
              data = ArrayHelper.getAllOperator(data, c.field, c.value, c.operator);
              break;
          }
        });
        const result = this.repositories.person.convertAllToModel(
          au.churchId,
          data,
          au.checkAccess(Permissions.people.edit)
        );
        return this.filterPeople(result, au);
      }
    });
  }

  @httpPost("/")
  public async save(
    req: express.Request<{}, {}, Person[]>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      let isSelfPermissionValid = false;
      if (au.checkAccess(Permissions.people.editSelf)) {
        isSelfPermissionValid = req.body[0].id === au.personId;
      }
      if (!au.checkAccess(Permissions.people.edit) && !isSelfPermissionValid) return this.json({}, 401);
      else {
        const promises: Promise<Person>[] = [];
        req.body.forEach((person) => {
          person.churchId = au.churchId;
          if (person.contactInfo === undefined) person.contactInfo = {};
          promises.push(
            this.repositories.person.save(person).then(async (p) => {
              // const r = this.repositories.person.convertToModel(au.churchId, p);
              p.churchId = au.churchId;
              if (p.photo !== undefined && p.photo.startsWith("data:image/png;base64,"))
                await this.savePhoto(au.churchId, p);
              return p;
            })
          );
        });
        return this.repositories.person.convertAllToModel(
          au.churchId,
          await Promise.all(promises),
          au.checkAccess(Permissions.people.edit)
        );
      }
    });
  }

  @httpDelete("/:id")
  public async delete(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.people.edit)) return this.json({}, 401);
      else {
        await this.repositories.person.delete(au.churchId, id);
        return this.json({});
      }
    });
  }

  private async savePhoto(churchId: string, person: Person) {
    const base64 = person.photo.split(",")[1];
    const key = "/" + churchId + "/membership/people/" + person.id + ".png";
    return FileStorageHelper.store(key, "image/png", Buffer.from(base64, "base64")).then(async () => {
      person.photoUpdated = new Date();
      person.photo = key + "?dt=" + person.photoUpdated.getTime().toString();
      await this.repositories.person.save(person);
    });
  }

  private async appendFormSubmissions(churchId: string, person: Person) {
    const submissions: FormSubmission[] = this.repositories.formSubmission.convertAllToModel(
      churchId,
      await this.repositories.formSubmission.loadForContent(churchId, "person", person.id)
    );
    if (submissions.length > 0) {
      const formIds: string[] = [];
      submissions.forEach((s) => {
        if (formIds.indexOf(s.formId) === -1) formIds.push(s.formId);
      });
      const forms: Form[] = this.repositories.form.convertAllToModel(
        churchId,
        await this.repositories.form.loadByIds(churchId, formIds)
      );

      person.formSubmissions = [];
      submissions.forEach((s) => {
        forms.forEach((f) => {
          if (f.id === s.formId) s.form = f;
        });
        if (s.form !== undefined) person.formSubmissions.push(s);
      });
    }
  }

  private filterPeople(people: Person[], au: AuthenticatedUser) {
    if (au.checkAccess(Permissions.people.view)) return people;
    else {
      const result: Person[] = [];
      people.forEach((p) => {
        if (p.membershipStatus === "Member" || p.membershipStatus === "Staff") result.push(p);
      });
      return result;
    }
  }

  private async isMember(membershipStatus: string): Promise<boolean> {
    // const person = await this.repositories.person.load(churchId, personId);
    if (membershipStatus === "Member" || membershipStatus === "Staff") return true;
    return false;
  }

  private async checkVisibilityPref(personId: string, au: AuthenticatedUser, person: Person) {
    const personPref: { address: string; phone: string; email: string } = await this.getPreferences(
      au.churchId,
      personId
    );
    const p = { ...person };

    // check address visibility preferences
    if (personPref.address === "everyone") {
      p.contactInfo.address1 = person.contactInfo.address1; // show to everyone
    } else if (personPref.address === "members" && !(await this.isMember(au.membershipStatus))) {
      p.contactInfo.address1 = undefined; // hide from non-members
    } else if (personPref.address === "groups") {
      const isInGroup = await this.checkGroupMembership(au, personId);
      p.contactInfo.address1 = isInGroup ? person.contactInfo.address1 : undefined; // show only if in the same group
    }

    // check phone visibility preferences
    if (personPref.phone === "everyone") {
      p.contactInfo.mobilePhone = person.contactInfo.mobilePhone;
      p.contactInfo.homePhone = person.contactInfo.homePhone;
      p.contactInfo.workPhone = person.contactInfo.workPhone;
    } else if (personPref.phone === "members" && !(await this.isMember(au.membershipStatus))) {
      p.contactInfo.mobilePhone = undefined;
      p.contactInfo.homePhone = undefined;
      p.contactInfo.workPhone = undefined;
    } else if (personPref.phone === "groups") {
      const isInGroup = await this.checkGroupMembership(au, personId);
      p.contactInfo.mobilePhone = isInGroup ? person.contactInfo.mobilePhone : undefined;
      p.contactInfo.homePhone = isInGroup ? person.contactInfo.homePhone : undefined;
      p.contactInfo.workPhone = isInGroup ? person.contactInfo.workPhone : undefined;
    }

    // check email visibility preference
    if (personPref.email === "everyone") {
      p.contactInfo.email = person.contactInfo.email;
    } else if (personPref.email === "members" && !(await this.isMember(au.membershipStatus))) {
      p.contactInfo.email = undefined;
    } else if (personPref.email === "groups") {
      const isInGroup = await this.checkGroupMembership(au, personId);
      p.contactInfo.email = isInGroup ? person.contactInfo.email : undefined;
    }

    return p;
  }

  private async getPreferences(churchId: string, personId: string) {
    const personPreferences: VisibilityPreference = await this.repositories.visibilityPreference.loadForPerson(
      churchId,
      personId
    );
    const pref = {
      address: personPreferences?.address,
      phone: personPreferences?.phoneNumber,
      email: personPreferences?.email
    };

    if (!personPreferences?.address || !personPreferences?.phoneNumber || !personPreferences?.email) {
      const churchSettings = this.repositories.setting.convertAllToModel(
        churchId,
        await this.repositories.setting.loadPublicSettings(churchId)
      );
      const publicSettings: any = {};
      churchSettings?.forEach((s: any) => {
        publicSettings[s.keyName] = s.value;
      });

      if (!pref.address || pref.address === "") {
        if (publicSettings?.addressVisibility && publicSettings.addressVisibility !== "")
          pref.address = publicSettings.addressVisibility;
        else pref.address = "members";
      }
      if (!pref.phone || pref.phone === "") {
        if (publicSettings?.phoneVisibility && publicSettings.phoneVisibility !== "")
          pref.phone = publicSettings.phoneVisibility;
        else pref.phone = "members";
      }
      if (!pref.email || pref.email === "") {
        if (publicSettings?.emailVisibility && publicSettings.emailVisibility !== "")
          pref.email = publicSettings.emailVisibility;
        else pref.email = "members";
      }
    }

    return pref;
  }

  // Helper method to check if the user is in at least one group with the person
  private async checkGroupMembership(au: AuthenticatedUser, personId: string): Promise<boolean> {
    const groups = await this.repositories.groupMember.loadForPerson(au.churchId, au.personId);
    const personGroups = await this.repositories.groupMember.loadForPerson(au.churchId, personId);
    return groups?.some((group: any) => personGroups.some((personGroup: any) => personGroup.groupId === group.groupId));
  }
}
