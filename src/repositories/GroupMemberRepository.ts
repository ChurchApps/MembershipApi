import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { GroupMember } from "../models";
import { PersonHelper } from "../helpers"

@injectable()
export class GroupMemberRepository {

    public async save(groupMember: GroupMember) {
        if (groupMember.id > 0) return this.update(groupMember); else return this.create(groupMember);
    }

    public async create(groupMember: GroupMember) {
        return DB.query(
            "INSERT INTO groupMembers (churchId, groupId, personId, joinDate) VALUES (?, ?, ?, NOW());",
            [groupMember.churchId, groupMember.groupId, groupMember.personId]
        ).then((row: any) => { groupMember.id = row.insertId; return groupMember; });
    }

    public async update(groupMember: GroupMember) {
        return DB.query(
            "UPDATE groupMembers SET  groupId=?, personId=? WHERE id=? and churchId=?",
            [groupMember.groupId, groupMember.personId, groupMember.id, groupMember.churchId]
        ).then(() => { return groupMember });
    }

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM groupMembers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM groupMembers WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM groupMembers WHERE churchId=?;", [churchId]);
    }

    public async loadForGroup(churchId: number, groupId: number) {
        const sql = "SELECT gm.*, p.photoUpdated, p.displayName, p.email"
            + " FROM groupMembers gm"
            + " INNER JOIN people p on p.id=gm.personId"
            + " WHERE gm.churchId=? AND gm.groupId=?"
            + " ORDER BY p.lastName, p.firstName;"
        return DB.query(sql, [churchId, groupId]);
    }

    public async loadForPerson(churchId: number, personId: number) {
        const sql = "SELECT gm.*, g.name as groupName"
            + " FROM groupMembers gm"
            + " INNER JOIN `groups` g on g.Id=gm.groupId"
            + " WHERE gm.churchId=? AND gm.personId=?"
            + " ORDER BY g.name;"
        return DB.query(sql, [churchId, personId]);
    }


    public convertToModel(churchId: number, data: any) {
        const result: GroupMember = { id: data.id, groupId: data.groupId, personId: data.personId, joinDate: data.joinDate }
        if (data.displayName !== undefined) {
            result.person = { id: result.personId, photoUpdated: data.photoUpdated, name: { display: data.displayName }, contactInfo: { email: data.email } };
            result.person.photo = PersonHelper.getPhotoUrl(churchId, result.person);
        }
        if (data.groupName !== undefined) result.group = { id: result.groupId, name: data.groupName };

        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: GroupMember[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
