import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Group } from "../models";

@injectable()
export class GroupRepository {

    public async save(group: Group) {
        if (group.id > 0) return this.update(group); else return this.create(group);
    }

    public async create(group: Group) {
        return DB.query(
            "INSERT INTO `groups` (churchId, categoryName, name, trackAttendance, parentPickup, removed) VALUES (?, ?, ?, ?, ?, 0);",
            [group.churchId, group.categoryName, group.name, group.trackAttendance, group.parentPickup]
        ).then((row: any) => { group.id = row.insertId; return group; });
    }

    public async update(group: Group) {
        return DB.query(
            "UPDATE `groups` SET churchId=?, categoryName=?, name=?, trackAttendance=?, parentPickup=? WHERE id=? and churchId=?",
            [group.churchId, group.categoryName, group.name, group.trackAttendance, group.parentPickup, group.id, group.churchId]
        ).then(() => { return group });
    }

    public async delete(churchId: number, id: number) {
        DB.query("UPDATE `groups` SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM `groups` WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT *, (SELECT COUNT(*) FROM groupMembers gm WHERE gm.groupId=g.id) AS memberCount FROM `groups` g WHERE churchId=? AND removed=0 ORDER by categoryName, name;", [churchId]);
    }

    public async loadByIds(churchId: number, ids: number[]) {
        const sql = "SELECT * FROM `groups` WHERE churchId=? AND removed=0 AND id IN (" + ids.join(",") + ") ORDER by name";
        return DB.query(sql, [churchId]);
    }

    public async search(churchId: number, campusId: number, serviceId: number, serviceTimeId: number) {
        const sql = "SELECT g.id, g.categoryName, g.name"
            + " FROM `groups` g"
            + " LEFT OUTER JOIN groupServiceTimes gst on gst.groupId=g.id"
            + " LEFT OUTER JOIN serviceTimes st on st.id=gst.serviceTimeId"
            + " LEFT OUTER JOIN services s on s.id=st.serviceId"
            + " WHERE g.churchId = ? AND (?=0 OR gst.serviceTimeId=?) AND (?=0 OR st.serviceId=?) AND (? = 0 OR s.campusId = ?) and g.removed=0"
            + " GROUP BY g.id, g.categoryName, g.name ORDER BY g.name";
        return DB.query(sql, [churchId, serviceTimeId, serviceTimeId, serviceId, serviceId, campusId, campusId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Group = { id: data.id, categoryName: data.categoryName, name: data.name, trackAttendance: data.trackAttendance, parentPickup: data.parentPickup, memberCount: data.memberCount };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Group[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
