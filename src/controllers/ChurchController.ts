import { controller, httpPost } from "inversify-express-utils";
import { Household, Group, Person } from "../models";
import { UserInterface, ChurchInterface } from "../helpers";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";

type CreatePerson = {
  firstName: string,
  lastName: string,
  churchId: string,
  email: string
}

@controller("/churches")
export class ChurchController extends MembershipBaseController {

    @httpPost("/init")
    public async init(req: express.Request<{}, {}, { user: UserInterface, church: ChurchInterface }>, res: express.Response): Promise<any> {
        return this.actionWrapper(req, res, async ({ churchId, email }) => {
            const { firstName, lastName } = req.body.user;
            const person = await this.createPerson({ firstName, lastName, churchId, email });
            const group = await this.createGroup(churchId);
            return { person, group };
        });
    }

    async createGroup(churchId: string) {
        const groups = await this.repositories.group.loadAll(churchId);
        if (groups.length === 0) {
            const group: Group = { churchId, name: "Worship Service", categoryName: "Worship Service", trackAttendance: true, parentPickup: false };
            await this.repositories.group.save(group);
            return group;
        }
    }

    async createPerson({ firstName, lastName, churchId, email }: CreatePerson) {
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


