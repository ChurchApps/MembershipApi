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
            // todo: why email is not even set in au?
            console.log(req.body)
            promises.push(this.createPerson(req.body.user.displayName, au.churchId, au.email));
            promises.push(this.createGroup(au.churchId));
            const result = await Promise.all(promises);
            return result;
        });
    }

    async createGroup(churchId: string) {
        const groups = await this.repositories.group.loadAll(churchId);
        if (groups.length === 0) {
            const group: Group = { churchId, name: "Worship Service", categoryName: "Worship Service", trackAttendance: true, parentPickup: false };
            await this.repositories.group.save(group);
        }
    }

    async createPerson(displayName: string, churchId: string, email: string) {
        const nameParts = displayName.split(' ');
        const lastName = nameParts[nameParts.length - 1];
        const firstName = nameParts[0];

        let household: Household = { churchId, name: lastName };
        await this.repositories.household.save(household).then(h => household = h);

        const person: Person = {
            churchId, householdId: household.id, householdRole: "Head",
            contactInfo: { email },
            name: { first: firstName, last: lastName },
        };
        await this.repositories.person.save(person);
        return person;
    }

}


