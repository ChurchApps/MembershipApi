import { controller, httpPost } from "inversify-express-utils";
import { Household, Group, Person } from "../models";
import { UserInterface, ChurchInterface } from "../helpers";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";

@controller("/churches")
export class ChurchController extends MembershipBaseController {

    async validateInit(churchId: number) {
        const errors: string[] = [];
        // const campuses = await this.repositories.campus.loadAll(churchId);
        // if (campuses.length > 0) errors.push("Church already initialized");
        return errors;
    }

    @httpPost("/init")
    public async init(req: express.Request<{}, {}, { user: UserInterface, church: ChurchInterface }>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {

            const errors = await this.validateInit(au.churchId);
            if (errors.length > 0) return this.denyAccess(errors);
            else {
                const nameParts = req.body.user.displayName.split(' ');
                const lastName = nameParts[nameParts.length - 1];
                const firstName = nameParts[0];

                // campus, household, groups
                let promises: Promise<any>[] = [];
                // const campus: Campus = { churchId: au.churchId, name: req.body.church.name };
                let household: Household = { churchId: au.churchId, name: lastName };
                let group: Group = { churchId: au.churchId, name: "Worship Service", categoryName: "Worship Service", trackAttendance: true, parentPickup: false };
                // promises.push(this.repositories.campus.save(campus).then(c => campus = c));
                promises.push(this.repositories.household.save(household).then(h => household = h));
                promises.push(this.repositories.group.save(group).then(g => group = g));
                await Promise.all(promises);

                // person, service
                promises = [];
                let person: Person = {
                    churchId: au.churchId, userId: au.id, householdId: household.id, householdRole: "Head",
                    contactInfo: { email: req.body.user.email },
                    name: { first: firstName, last: lastName },
                };
                // const service: Service = { churchId: au.churchId, campusId: campus.id, name: "Sunday Morning" };
                promises.push(this.repositories.person.save(person).then(p => person = p));
                // promises.push(this.repositories.service.save(service).then(s => service = s));
                await Promise.all(promises);

                // const serviceTime: ServiceTime = { churchId: au.churchId, name: "9:00", serviceId: service.id };
                // await this.repositories.serviceTime.save(serviceTime).then(st => serviceTime = st);

                // const groupServiceTime: GroupServiceTime = { churchId: au.churchId, groupId: group.id, serviceTimeId: serviceTime.id };
                // await this.repositories.groupServiceTime.save(groupServiceTime);

                return {};
            }

        });
    }


}


