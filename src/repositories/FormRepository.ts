import { injectable } from "inversify";
import { DB } from "@churchapps/apihelper";
import { Form } from "../models";
import { DateHelper, UniqueIdHelper } from "../helpers";

@injectable()
export class FormRepository {
  public save(form: Form) {
    return form.id ? this.update(form) : this.create(form);
  }

  private async create(form: Form) {
    form.id = UniqueIdHelper.shortId();
    const startDate = form.accessStartTime ? DateHelper.toMysqlDate(form.accessStartTime) : null;
    const endDate = form.accessEndTime ? DateHelper.toMysqlDate(form.accessEndTime) : null;
    const sql =
      "INSERT INTO forms (id, churchId, name, contentType, createdTime, modifiedTime, accessStartTime, accessEndTime, restricted, archived, removed, thankYouMessage) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, 0, 0, ?);";
    const params = [
      form.id,
      form.churchId,
      form.name,
      form.contentType,
      startDate,
      endDate,
      form.restricted,
      form.thankYouMessage
    ];
    await DB.query(sql, params);
    return form;
  }

  private async update(form: Form) {
    const startDate = form.accessStartTime ? DateHelper.toMysqlDate(form.accessStartTime) : null;
    const endDate = form.accessEndTime ? DateHelper.toMysqlDate(form.accessEndTime) : null;
    const sql =
      "UPDATE forms SET name=?, contentType=?, restricted=?, modifiedTime=NOW(), accessStartTime=?, accessEndTime=?, archived=?, thankYouMessage=? WHERE id=? and churchId=?";
    const params = [
      form.name,
      form.contentType,
      form.restricted,
      startDate,
      endDate,
      form.archived,
      form.thankYouMessage,
      form.id,
      form.churchId
    ];
    await DB.query(sql, params);
    return form;
  }

  public delete(churchId: string, id: string) {
    return DB.query("UPDATE forms SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM forms WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
  }

  public loadAll(churchId: string) {
    return DB.query("SELECT * FROM forms WHERE churchId=? AND removed=0 AND archived=0;", [churchId]);
  }

  public loadAllArchived(churchId: string) {
    return DB.query("SELECT * FROM forms WHERE churchId=? AND removed=0 AND archived=1;", [churchId]);
  }

  public loadByIds(churchId: string, ids: string[]) {
    const quotedAndCommaSeparated = ids.length === 0 ? "" : "'" + ids.join("','") + "'";
    const sql =
      "SELECT * FROM forms WHERE churchId=? AND removed=0 AND archived=0 AND id IN (" +
      quotedAndCommaSeparated +
      ") ORDER by name";
    return DB.query(sql, [churchId]);
  }

  public loadNonMemberForms(churchId: string) {
    return DB.query("SELECT * FROM forms WHERE contentType<>'form' AND churchId=? AND removed=0 AND archived=0", [
      churchId
    ]);
  }

  public loadNonMemberArchivedForms(churchId: string) {
    return DB.query("SELECT * FROM forms WHERE contentType<>'form' AND churchId=? AND removed=0 AND archived=1", [
      churchId
    ]);
  }

  public loadMemberForms(churchId: string, personId: string) {
    return DB.query(
      "SELECT f.* , mp.action FROM forms f  " +
        "LEFT JOIN memberPermissions mp " +
        "ON mp.contentId = f.id " +
        "WHERE mp.memberId=? AND f.churchId=? AND f.removed=0 AND f.archived=0",
      [personId, churchId]
    );
  }

  public loadMemberArchivedForms(churchId: string, personId: string) {
    return DB.query(
      "SELECT f.* FROM forms f  " +
        "LEFT JOIN memberPermissions mp " +
        "ON mp.contentId = f.id " +
        "WHERE mp.memberId=? AND f.churchId=? AND f.removed=0 AND f.archived=1",
      [personId, churchId]
    );
  }

  public loadWithMemberPermissions(churchId: string, formId: string, personId: string) {
    return DB.queryOne(
      "SELECT f.*, mp.action FROM forms f " +
        "LEFT JOIN memberPermissions mp " +
        "ON mp.contentId = f.id " +
        "WHERE f.id=? AND f.churchId=? AND mp.memberId=? AND f.removed=0 AND archived=0",
      [formId, churchId, personId]
    );
  }

  public access(id: string) {
    return DB.queryOne("SELECT id, name, restricted FROM forms WHERE id=? AND removed=0 AND archived=0;", [id]);
  }

  public convertToModel(churchId: string, data: any) {
    const result: Form = {
      id: data.id,
      name: data.name,
      contentType: data.contentType,
      createdTime: data.createdTime,
      modifiedTime: data.modifiedTime,
      accessStartTime: data.accessStartTime,
      accessEndTime: data.accessEndTime,
      restricted: data.restricted,
      archived: data.archived,
      action: data.action,
      thankYouMessage: data.thankYouMessage
    };
    return result;
  }

  public convertAllToModel(churchId: string, data: any[]) {
    const result: Form[] = [];
    data.forEach((d) => result.push(this.convertToModel(churchId, d)));
    return result;
  }
}
