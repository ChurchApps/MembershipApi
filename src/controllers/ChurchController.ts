import { controller, httpPost } from "inversify-express-utils";
import { Household, Group, Person } from "../models";
import { UserInterface, ChurchInterface } from "../helpers";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";

@controller("/churches")
export class ChurchController extends MembershipBaseController {


    @httpPost("/init")
    public async init(req: express.Request<{}, {}, { user: UserInterface, church: ChurchInterface }>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async (au) => {
            const promises: Promise<any>[] = [];
            promises.push(this.createPerson(req.body.user.displayName, au.churchId, au.id, au.email));
            promises.push(this.createGroup(au.churchId));
            return {};
        });
    }

    async createGroup(churchId: number) {
        const groups = await this.repositories.group.loadAll(churchId);
        if (groups.length === 0) {
            const group: Group = { churchId, name: "Worship Service", categoryName: "Worship Service", trackAttendance: true, parentPickup: false };
            await this.repositories.group.save(group);
        }
    }

    async createPerson(displayName: string, churchId: number, userId: number, email: string) {
        const p = await this.repositories.person.loadByUserId(churchId, userId);
        if (p === null) {
            const nameParts = displayName.split(' ');
            const lastName = nameParts[nameParts.length - 1];
            const firstName = nameParts[0];

            let household: Household = { churchId, name: lastName };
            await this.repositories.household.save(household).then(h => household = h);

            const person: Person = {
                churchId, userId, householdId: household.id, householdRole: "Head",
                contactInfo: { email },
                name: { first: firstName, last: lastName },
            };
            await this.repositories.person.save(person);
        }
    }

}


