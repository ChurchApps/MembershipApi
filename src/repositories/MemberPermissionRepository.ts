import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { MemberPermission } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class MemberPermissionRepository {

    public save(memberPermission: MemberPermission) {
        return memberPermission.id ? this.update(memberPermission) : this.create(memberPermission);
    }

    private async create(memberPermission: MemberPermission) {
        memberPermission.id = UniqueIdHelper.shortId();
        const sql = "INSERT INTO memberPermissions (id, churchId, memberId, contentType, contentId, action) VALUES (?, ?, ?, ?, ?, ?);";
        const params = [memberPermission.id, memberPermission.churchId, memberPermission.memberId, memberPermission.contentType, memberPermission.contentId, memberPermission.action];
        await DB.query(sql, params);
        return memberPermission;
    }

    private async update(memberPermission: MemberPermission) {
        const sql = "UPDATE memberPermissions SET memberId=?, contentType=?, contentId=?, action=? WHERE id=? and churchId=?";
        const params = [memberPermission.memberId, memberPermission.contentType, memberPermission.contentId, memberPermission.action, memberPermission.id, memberPermission.churchId];
        await DB.query(sql, params);
        return memberPermission;
    }

    public delete(churchId: string, id: string) {
        return DB.query("DELETE FROM memberPermissions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public deleteByMemberId(churchId: string, memberId: string) {
        return DB.query("DELETE FROM memberPermissions WHERE memberId=? AND churchId=?;", [memberId, churchId]);
    }

    public load(churchId: string, id: string) {
        return DB.queryOne("SELECT * FROM memberPermissions WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public loadAll(churchId: string) {
        return DB.query("SELECT * FROM memberPermissions WHERE churchId=?;", [churchId]);
    }

    public loadPeopleByForm(churchId: string, formId: string) {
        const sql = "SELECT mp.*, p.displayName as personName"
            + " FROM memberPermissions mp"
            + " INNER JOIN `people` p on p.id=mp.memberId"
            + " WHERE mp.churchId=? AND mp.contentId=?"
            + " ORDER BY mp.action;"
        return DB.query(sql, [churchId, formId]);
    }

    public convertToModel(churchId: string, data: any) {
        const result: MemberPermission = { id: data.id, churchId, memberId: data.memberId, contentType: data.contentType, contentId: data.contentId, action: data.action, personName: data.personName };
        return result;
    }

    public convertAllToModel(churchId: string, data: any[]) {
        const result: MemberPermission[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

    private existingPermissionRecord(churchId: string, contentId: string) {
        return DB.queryOne("SELECT * FROM memberPermissions WHERE contentId=? AND churchId=?;", [contentId, churchId]);
    }
}
