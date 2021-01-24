import { Person } from "../models"

export class PersonHelper {
    public static getPhotoUrl(churchId: number, person: Person) {
        if (person.photoUpdated === null || person.photoUpdated === undefined) return "/images/sample-profile.png";
        else return "/content/c/" + churchId + "/p/" + person.id + ".png" + "?dt=" + person.photoUpdated.getTime().toString();
    }

    public static getDisplayName(person: Person) {
        if (person?.name?.nick !== null && person?.name?.nick !== "" && person?.name?.nick !== undefined) return person.name.first + " \"" + person.name.nick + "\" " + person.name.last;
        else return person.name.first + " " + person.name.last;
    }

}