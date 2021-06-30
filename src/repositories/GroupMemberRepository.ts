import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { GroupMember } from "../models";
import { PersonHelper } from "../helpers"
import { UniqueIdHelper } from "../helpers";

@injectable()
export class GroupMemberRepository {

    public save(groupMember: GroupMember) {
        return groupMember.id ? this.update(groupMember) : this.create(groupMember);
    }

    private async create(groupMember: GroupMember) {
        groupMember.id = UniqueIdHelper.shortId();
        const sql = "INSERT INTO groupMembers (id, churchId, groupId, personId, joinDate) VALUES (?, ?, ?, ?, NOW());";
        const params = [groupMember.id, groupMember.churchId, groupMember.groupId, groupMember.personId];
        await DB.query(sql, params);
        return groupMember;
    }

    private async update(groupMember: GroupMember) {
        const sql = "UPDATE groupMembers SET  groupId=?, personId=? WHERE id=? and churchId=?";
        const params = [groupMember.groupId, groupMember.personId, groupMember.id, groupMember.churchId];
        await DB.query(sql, params);
        return groupMember;
    }

    public delete(churchId: string, id: string) {
        return DB.query("DELETE FROM groupMembers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public load(churchId: string, id: string) {
        return DB.queryOne("SELECT * FROM groupMembers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public loadAll(churchId: string) {
        return DB.query("SELECT * FROM groupMembers WHERE churchId=?;", [churchId]);
    }

    public loadForGroup(churchId: string, groupId: string) {
        const sql = "SELECT gm.*, p.photoUpdated, p.displayName, p.email"
            + " FROM groupMembers gm"
            + " INNER JOIN people p on p.id=gm.personId"
            + " WHERE gm.churchId=? AND gm.groupId=?"
            + " ORDER BY p.lastName, p.firstName;"
        return DB.query(sql, [churchId, groupId]);
    }

    public loadForPerson(churchId: string, personId: string) {
        const sql = "SELECT gm.*, g.name as groupName"
            + " FROM groupMembers gm"
            + " INNER JOIN `groups` g on g.Id=gm.groupId"
            + " WHERE gm.churchId=? AND gm.personId=?"
            + " ORDER BY g.name;"
        return DB.query(sql, [churchId, personId]);
    }


    public convertToModel(churchId: string, data: any) {
        const result: GroupMember = { id: data.id, groupId: data.groupId, personId: data.personId, joinDate: data.joinDate }
        if (data.displayName !== undefined) {
            result.person = { id: result.personId, photoUpdated: data.photoUpdated, name: { display: data.displayName }, contactInfo: { email: data.email } };
            result.person.photo = PersonHelper.getPhotoUrl(churchId, result.person);
        }
        if (data.groupName !== undefined) result.group = { id: result.groupId, name: data.groupName };

        return result;
    }

    public convertAllToModel(churchId: string, data: any[]) {
        const result: GroupMember[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
