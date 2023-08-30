import { injectable } from "inversify";
import { DB } from "@churchapps/apihelper";
import { Person } from "../models";
import { PersonHelper, DateHelper } from "../helpers";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class PersonRepository {

  public save(person: Person) {
    person.name.display = PersonHelper.getDisplayNameFromPerson(person);
    return person.id ? this.update(person) : this.create(person);
  }

  private async create(person: Person) {
    person.id = UniqueIdHelper.shortId();
    const birthDate = DateHelper.toMysqlDate(person.birthDate);
    const anniversary = DateHelper.toMysqlDate(person.anniversary);
    const photoUpdated = DateHelper.toMysqlDate(person.photoUpdated);
    const sql = "INSERT INTO people (id, churchId, displayName, firstName, middleName, lastName, nickName, prefix, suffix, birthDate, gender, maritalStatus, anniversary, membershipStatus, homePhone, mobilePhone, workPhone, email, nametagNotes, address1, address2, city, state, zip, photoUpdated, householdId, householdRole, conversationId, removed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);";
    const params = [
      person.id,
      person.churchId,
      person.name.display, person.name.first, person.name.middle, person.name.last, person.name.nick, person.name.prefix, person.name.suffix,
      birthDate, person.gender, person.maritalStatus, anniversary, person.membershipStatus,
      person.contactInfo.homePhone, person.contactInfo.mobilePhone, person.contactInfo.workPhone, person.contactInfo.email, person.nametagNotes, person.contactInfo.address1, person.contactInfo.address2, person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip,
      photoUpdated, person.householdId, person.householdRole, person.conversationId
    ];
    await DB.query(sql, params);
    return person;
  }

  public updateOptedOut(personId: string, optedOut: boolean) {
    const sql = "UPDATE people SET optedOut=? WHERE id=?";
    const params = [
      optedOut,
      personId
    ]
    return DB.query(sql, params);
  }

  private async update(person: Person) {
    const birthDate = DateHelper.toMysqlDate(person.birthDate);
    const anniversary = DateHelper.toMysqlDate(person.anniversary);
    const photoUpdated = DateHelper.toMysqlDate(person.photoUpdated);
    const sql = "UPDATE people SET displayName=?, firstName=?, middleName=?, lastName=?, nickName=?, prefix=?, suffix=?, birthDate=?, gender=?, maritalStatus=?, anniversary=?, membershipStatus=?, homePhone=?, mobilePhone=?, workPhone=?, email=?, nametagNotes=?, address1=?, address2=?, city=?, state=?, zip=?, photoUpdated=?, householdId=?, householdRole=?, conversationId=? WHERE id=? and churchId=?";
    const params = [
      person.name.display, person.name.first, person.name.middle, person.name.last, person.name.nick, person.name.prefix, person.name.suffix,
      birthDate, person.gender, person.maritalStatus, anniversary, person.membershipStatus,
      person.contactInfo.homePhone, person.contactInfo.mobilePhone, person.contactInfo.workPhone, person.contactInfo.email, person.nametagNotes, person.contactInfo.address1, person.contactInfo.address2, person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip,
      photoUpdated, person.householdId, person.householdRole, person.conversationId, person.id, person.churchId
    ];
    await DB.query(sql, params);
    return person;
  }

  public async updateHousehold(person: Person) {
    const sql = "UPDATE people SET householdId=?, householdRole=? WHERE id=? and churchId=?";
    const params = [person.householdId, person.householdRole, person.id, person.churchId];
    await DB.query(sql, params);
    return person;
  }

  public delete(churchId: string, id: string) {
    return DB.query("UPDATE people SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public restore(churchId: string, id: string) {
    return DB.query("UPDATE people SET removed=0 WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM people WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
  }

  public loadByIds(churchId: string, ids: string[]) {
    return DB.query("SELECT * FROM people WHERE id IN (?) AND churchId=?;", [ids, churchId]);
  }

  public loadMembers(churchId: string) {
    return DB.query("SELECT * FROM people WHERE churchId=? AND removed=0 and membershipStatus in ('Member', 'Staff');", [churchId]);
  }

  public loadAll(churchId: string) {
    return DB.query("SELECT * FROM people WHERE churchId=? AND removed=0;", [churchId]);
  }

  public loadRecent(churchId: string, filterOptedOut?: boolean) {
    const filter = filterOptedOut ? " AND (optedOut = FALSE OR optedOut IS NULL)" : "";
    return DB.query("SELECT * FROM (SELECT * FROM people WHERE churchId=? AND removed=0" + filter + " order by id desc limit 25) people ORDER BY lastName, firstName;", [churchId]);
  }

  public loadByHousehold(churchId: string, householdId: string) {
    return DB.query("SELECT * FROM people WHERE churchId=? and householdId=? AND removed=0;", [churchId, householdId]);
  }

  public search(churchId: string, term: string, filterOptedOut?: boolean) {
    const filter = filterOptedOut ? " AND (optedOut = FALSE OR optedOut IS NULL)" : "";
    return DB.query(
      "SELECT * FROM people WHERE churchId=? AND concat(IFNULL(FirstName,''), ' ', IFNULL(MiddleName,''), ' ', IFNULL(NickName,''), ' ', IFNULL(LastName,'')) LIKE ? AND removed=0" + filter + " LIMIT 100;",
      [churchId, "%" + term.replace(" ", "%") + "%"]
    );
  }

  public searchPhone(churchId: string, phonestring: string) {
    const phoneSearch = "%" + phonestring.replace(/ |-/g, "%") + "%";
    return DB.query(
      "SELECT * FROM people WHERE churchId=? AND (REPLACE(HomePhone,'-','') LIKE ? OR REPLACE(WorkPhone,'-','') LIKE ? OR REPLACE(MobilePhone,'-','') LIKE ?) AND removed=0 LIMIT 100;",
      [churchId, phoneSearch, phoneSearch, phoneSearch]
    );
  }

  public searchEmail(churchId: string, email: string) {
    return DB.query("SELECT * FROM people WHERE churchId=? AND email like ? AND removed=0 LIMIT 100;", [churchId, "%" + email + "%"]);
  }

  public loadAttendees(churchId: string, campusId: string, serviceId: string, serviceTimeId: string, categoryName: string, groupId: string, startDate: Date, endDate: Date) {
    const params = [];
    params.push(churchId);
    params.push(startDate);
    params.push(endDate);

    let sql = "SELECT p.Id, p.churchId, p.displayName, p.firstName, p.lastName, p.photoUpdated"
      + " FROM visitSessions vs"
      + " INNER JOIN visits v on v.id = vs.visitId"
      + " INNER JOIN sessions s on s.id = vs.sessionId"
      + " INNER JOIN people p on p.id = v.personId"
      + " INNER JOIN `groups` g on g.id = s.groupId"
      + " LEFT OUTER JOIN serviceTimes st on st.id = s.serviceTimeId"
      + " LEFT OUTER JOIN services ser on ser.id = st.serviceId"
      + " WHERE p.churchId = ? AND v.visitDate BETWEEN ? AND ?";

    if (!UniqueIdHelper.isMissing(campusId)) { sql += " AND ser.campusId=?"; params.push(campusId); }
    if (!UniqueIdHelper.isMissing(serviceId)) { sql += " AND ser.id=?"; params.push(serviceId); }
    if (!UniqueIdHelper.isMissing(serviceTimeId)) { sql += " AND st.id=?"; params.push(serviceTimeId); }
    if (categoryName !== "") { sql += " AND g.categoryName=?"; params.push(categoryName); }
    if (!UniqueIdHelper.isMissing(groupId)) { sql += " AND g.id=?"; params.push(groupId); }
    sql += " GROUP BY p.id, p.displayName, p.firstName, p.lastName, p.photoUpdated";
    sql += " ORDER BY p.lastName, p.firstName";
    return DB.query(sql, params);
  }

  public convertToModel(churchId: string, data: any, canEdit: boolean) {
    const result: Person = {
      name: { display: data.displayName, first: data.firstName, last: data.lastName, middle: data.middleName, nick: data.nickName, prefix: data.prefix, suffix: data.suffix },
      contactInfo: { address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, homePhone: data.homePhone, workPhone: data.workPhone, email: data.email, mobilePhone: data.mobilePhone },
      photo: data.photo, anniversary: data.anniversary, birthDate: data.birthDate, gender: data.gender, householdId: data.householdId, householdRole: data.householdRole, maritalStatus: data.maritalStatus, nametagNotes: data.nametagNotes,
      membershipStatus: data.membershipStatus, photoUpdated: data.photoUpdated, id: data.id, importKey: data.importKey, optedOut: data.optedOut
    }
    if (canEdit) result.conversationId = data.conversationId;
    if (result.photo === undefined) result.photo = PersonHelper.getPhotoPath(churchId, result);
    return result;
  }

  public convertAllToModel(churchId: string, data: any[], canEdit: boolean) {
    const result: Person[] = [];
    data.forEach(d => result.push(this.convertToModel(churchId, d, canEdit)));
    return result;
  }

}
