import { Group, Person } from "./"

export class GroupMember {
    public id?: number;
    public churchId?: number;
    public groupId?: number;
    public personId?: number;
    public joinDate?: Date;
    public person?: Person;
    public group?: Group;
}
