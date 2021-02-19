import { Group, Person } from "./"

export class GroupMember {
    public id?: string;
    public churchId?: string;
    public groupId?: string;
    public personId?: string;
    public joinDate?: Date;
    public person?: Person;
    public group?: Group;
}
