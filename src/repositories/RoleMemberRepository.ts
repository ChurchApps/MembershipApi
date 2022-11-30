import { DB } from "../apiBase/db";
import { RoleMember } from "../models";
import { UniqueIdHelper } from "../helpers";

export class RoleMemberRepository {

    public save(roleMember: RoleMember) {
        return roleMember.id ? this.update(roleMember) : this.create(roleMember);
    }

    private async create(roleMember: RoleMember) {
        roleMember.id = UniqueIdHelper.shortId();
        const sql = "INSERT INTO roleMembers (id, churchId, roleId, userId, dateAdded, addedBy) VALUES (?, ?, ?, ?, NOW(), ?);";
        const params = [roleMember.id, roleMember.churchId, roleMember.roleId, roleMember.userId, roleMember.addedBy];
        await DB.query(sql, params);
        return roleMember;
    }

    private async update(roleMember: RoleMember) {
        const sql = "UPDATE roleMembers SET roleId=?, userId=?, dateAdded=?, addedBy=? WHERE id=? AND churchId=?";
        const params = [roleMember.roleId, roleMember.userId, roleMember.dateAdded, roleMember.addedBy, roleMember.id, roleMember.churchId];
        await DB.query(sql, params);
        return roleMember;
    }

    public loadByRoleId(roleId: string, churchId: string): Promise<RoleMember[]> {
        return DB.query("SELECT rm.*, uc.personId FROM roleMembers rm LEFT JOIN userChurches uc ON rm.userId=uc.userId AND rm.churchId=uc.churchId WHERE roleId=? AND rm.churchId=?;", [roleId, churchId]);
    }

    public loadById(id: string, churchId: string): Promise<RoleMember> {
        return DB.queryOne("SELECT * FROM roleMembers WHERE id=? AND churchId=?", [id, churchId]);
    }

    public delete(id: string, churchId: string): Promise<RoleMember> {
        return DB.query("DELETE FROM roleMembers WHERE id=? AND churchId=?", [id, churchId]);
    }

    public deleteForRole(churchId: string, roleId: string) {
        const sql = "DELETE FROM roleMembers WHERE churchId=? AND roleId=?"
        const params = [churchId, roleId];
        return DB.query(sql, params);
    }

}
