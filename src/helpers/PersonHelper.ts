import { Repositories } from "../repositories";
import { Household, Person, UserChurch } from "../models";
import { AuthenticatedUser } from "../auth";
import { Permissions } from '../helpers/Permissions'
import { PersonHelper as BasePersonHelper } from "../apiBase/helpers/PersonHelper"

export class PersonHelper extends BasePersonHelper {

  public static async getPerson(churchId: string, email: string, firstName: string, lastName: string, canEdit: boolean) {
    const data: Person[] = await Repositories.getCurrent().person.searchEmail(churchId, email);
    if (data.length === 0) {
      const household: Household = { churchId, name: lastName }
      await Repositories.getCurrent().household.save(household);
      let newPerson: Person = {
        churchId,
        householdId: household.id,
        householdRole: "Head",
        name: { first: firstName, last: lastName },
        membershipStatus: "Guest",
        contactInfo: { email }
      }
      newPerson = await Repositories.getCurrent().person.save(newPerson);
      data.push(await Repositories.getCurrent().person.load(newPerson.churchId, newPerson.id));
    }
    const result = Repositories.getCurrent().person.convertAllToModel(churchId, data, canEdit);
    const person = result[0];
    if (person.removed) {
      person.removed = false;
      await Repositories.getCurrent().person.restore(person.churchId, person.id);
    }
    return person;
  }

  public static async claim(au: AuthenticatedUser, churchId: string) {
    if (au?.email) {
      let person: Person = null;
      if (au.personId) {
        const d = await Repositories.getCurrent().person.load(au.churchId, au.personId);
        if (d === null) person = await this.getPerson(churchId, au.email, au.firstName, au.lastName, au.checkAccess(Permissions.people.edit));
        else person = Repositories.getCurrent().person.convertToModel(au.churchId, d, au.checkAccess(Permissions.people.edit));
      } else {
        person = await this.getPerson(churchId, au.email, au.firstName, au.lastName, au.checkAccess(Permissions.people.edit));
      }

      const userChurch: UserChurch = {
        userId: au.id,
        churchId,
        personId: person.id
      }

      const existing: UserChurch = await Repositories.getCurrent().userChurch.loadByUserId(au.id, churchId);
      if (!existing) {
        const result = await Repositories.getCurrent().userChurch.save(userChurch);
        return Repositories.getCurrent().userChurch.convertToModel(result);
      } else {
        if (existing.personId !== person.id) {
          existing.personId = person.id;
          await Repositories.getCurrent().userChurch.save(existing);
        }
        return existing;
      }
    }
  }


}