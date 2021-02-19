import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Group } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class GroupRepository {

    public async save(group: Group) {
        if (UniqueIdHelper.isMissing(group.id)) return this.create(group); else return this.update(group);
    }

    public async create(group: Group) {
        group.id = UniqueIdHelper.shortId();
        return DB.query(
            "INSERT INTO `groups` (id, churchId, categoryName, name, trackAttendance, parentPickup, removed) VALUES (?, ?, ?, ?, ?, ?, 0);",
            [group.id, group.churchId, group.categoryName, group.name, group.trackAttendance, group.parentPickup]
        ).then(() => { return group; });
    }

    public async update(group: Group) {
        return DB.query(
            "UPDATE `groups` SET churchId=?, categoryName=?, name=?, trackAttendance=?, parentPickup=? WHERE id=? and churchId=?",
            [group.churchId, group.categoryName, group.name, group.trackAttendance, group.parentPickup, group.id, group.churchId]
        ).then(() => { return group });
    }

    public async delete(churchId: string, id: string) {
        DB.query("UPDATE `groups` SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: string, id: string) {
        return DB.queryOne("SELECT * FROM `groups` WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
    }

    public async loadAll(churchId: string) {
        return DB.query("SELECT *, (SELECT COUNT(*) FROM groupMembers gm WHERE gm.groupId=g.id) AS memberCount FROM `groups` g WHERE churchId=? AND removed=0 ORDER by categoryName, name;", [churchId]);
    }

    public async loadByIds(churchId: string, ids: string[]) {
        const sql = "SELECT * FROM `groups` WHERE churchId=? AND removed=0 AND id IN (" + ids.join(",") + ") ORDER by name";
        return DB.query(sql, [churchId]);
    }

    public async search(churchId: string, campusId: string, serviceId: string, serviceTimeId: string) {
        const sql = "SELECT g.id, g.categoryName, g.name"
            + " FROM `groups` g"
            + " LEFT OUTER JOIN groupServiceTimes gst on gst.groupId=g.id"
            + " LEFT OUTER JOIN serviceTimes st on st.id=gst.serviceTimeId"
            + " LEFT OUTER JOIN services s on s.id=st.serviceId"
            + " WHERE g.churchId = ? AND (?=0 OR gst.serviceTimeId=?) AND (?=0 OR st.serviceId=?) AND (? = 0 OR s.campusId = ?) and g.removed=0"
            + " GROUP BY g.id, g.categoryName, g.name ORDER BY g.name";
        return DB.query(sql, [churchId, serviceTimeId, serviceTimeId, serviceId, serviceId, campusId, campusId]);
    }

    public convertToModel(churchId: string, data: any) {
        const result: Group = { id: data.id, categoryName: data.categoryName, name: data.name, trackAttendance: data.trackAttendance, parentPickup: data.parentPickup, memberCount: data.memberCount };
        return result;
    }

    public convertAllToModel(churchId: string, data: any[]) {
        const result: Group[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
