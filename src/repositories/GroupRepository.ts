import { injectable } from "inversify";
import { DB } from "@churchapps/apihelper";
import { Group } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class GroupRepository {
  public save(group: Group) {
    this.convertFromModel(group);
    return group.id ? this.update(group) : this.create(group);
  }

  private async create(group: Group) {
    group.id = UniqueIdHelper.shortId();
    const sql =
      "INSERT INTO `groups` (id, churchId, categoryName, name, trackAttendance, parentPickup, printNameTag, about, photoUrl, tags, meetingTime, meetingLocation, labels, slug, removed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);";
    const params = [
      group.id,
      group.churchId,
      group.categoryName,
      group.name,
      group.trackAttendance,
      group.parentPickup,
      group.printNametag,
      group.about,
      group.photoUrl,
      group.tags,
      group.meetingTime,
      group.meetingLocation,
      group.labels,
      group.slug
    ];
    await DB.query(sql, params);
    return group;
  }

  private async update(group: Group) {
    const sql =
      "UPDATE `groups` SET churchId=?, categoryName=?, name=?, trackAttendance=?, parentPickup=?, printNametag=?, about=?, photoUrl=?, tags=?, meetingTime=?, meetingLocation=?, labels=?, slug=? WHERE id=? and churchId=?";
    const params = [
      group.churchId,
      group.categoryName,
      group.name,
      group.trackAttendance,
      group.parentPickup,
      group.printNametag,
      group.about,
      group.photoUrl,
      group.tags,
      group.meetingTime,
      group.meetingLocation,
      group.labels,
      group.slug,
      group.id,
      group.churchId
    ];
    await DB.query(sql, params);
    return group;
  }

  public delete(churchId: string, id: string) {
    return DB.query("UPDATE `groups` SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public deleteByIds(churchId: string, ids: string[]) {
    return DB.query("UPDATE `groups` SET removed=1 WHERE id IN (?) AND churchId=?;", [ids, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM `groups` WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
  }

  public loadPublicSlug(churchId: string, slug: string) {
    const sql = "SELECT * FROM `groups`" + " WHERE churchId = ? AND slug = ? AND removed=0";
    return DB.queryOne(sql, [churchId, slug]);
  }

  public loadByTag(churchId: string, tag: string) {
    return DB.query(
      "SELECT *, (SELECT COUNT(*) FROM groupMembers gm WHERE gm.groupId=g.id) AS memberCount FROM `groups` g WHERE churchId=? AND removed=0 AND tags like ? ORDER by categoryName, name;",
      [churchId, "%" + tag + "%"]
    );
  }

  public loadAll(churchId: string) {
    return DB.query(
      "SELECT *, (SELECT COUNT(*) FROM groupMembers gm WHERE gm.groupId=g.id) AS memberCount FROM `groups` g WHERE churchId=? AND removed=0 ORDER by categoryName, name;",
      [churchId]
    );
  }

  public loadForPerson(personId: string) {
    const sql =
      "SELECT distinct g.*" +
      " FROM groupMembers gm" +
      " INNER JOIN `groups` g on g.id=gm.groupId" +
      " WHERE personId=? and g.removed=0 and g.tags like '%standard%'" +
      " ORDER BY name";
    return DB.query(sql, [personId]);
  }

  public async loadByIds(churchId: string, ids: string[]) {
    const sql = "SELECT * FROM `groups` WHERE churchId=? AND id IN (?) ORDER by name";
    const result = await DB.query(sql, [churchId, ids]);
    return result;
  }

  public publicLabel(churchId: string, label: string) {
    const sql = "SELECT * FROM `groups`" + " WHERE churchId = ? AND labels LIKE ? AND removed=0" + " ORDER BY name";
    return DB.query(sql, [churchId, "%" + label + "%"]);
  }

  public search(churchId: string, campusId: string, serviceId: string, serviceTimeId: string) {
    const sql =
      "SELECT g.id, g.categoryName, g.name" +
      " FROM `groups` g" +
      " LEFT OUTER JOIN groupServiceTimes gst on gst.groupId=g.id" +
      " LEFT OUTER JOIN serviceTimes st on st.id=gst.serviceTimeId" +
      " LEFT OUTER JOIN services s on s.id=st.serviceId" +
      " WHERE g.churchId = ? AND (?=0 OR gst.serviceTimeId=?) AND (?=0 OR st.serviceId=?) AND (? = 0 OR s.campusId = ?) and g.removed=0" +
      " GROUP BY g.id, g.categoryName, g.name ORDER BY g.name";
    return DB.query(sql, [churchId, serviceTimeId, serviceTimeId, serviceId, serviceId, campusId, campusId]);
  }

  public convertFromModel(group: Group) {
    group.labels = null;
    if (group.labelArray?.length > 0) group.labels = group.labelArray.join(",");
  }

  public convertToModel(churchId: string, data: any) {
    const result: Group = {
      id: data.id,
      categoryName: data.categoryName,
      name: data.name,
      trackAttendance: data.trackAttendance,
      parentPickup: data.parentPickup,
      printNametag: data.printNametag,
      memberCount: data.memberCount,
      about: data.about,
      photoUrl: data.photoUrl,
      tags: data.tags,
      meetingTime: data.meetingTime,
      meetingLocation: data.meetingLocation,
      labelArray: [],
      slug: data.slug
    };
    data.labels?.split(",").forEach((label: string) => result.labelArray.push(label.trim()));
    return result;
  }

  public convertAllToModel(churchId: string, data: any[]) {
    const result: Group[] = [];
    data.forEach((d) => result.push(this.convertToModel(churchId, d)));
    return result;
  }
}
