import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Person } from "../models";
import { PersonHelper, DateTimeHelper } from "../helpers";

@injectable()
export class PersonRepository {

    public async save(person: Person) {
        person.name.display = PersonHelper.getDisplayName(person);
        if (person.id > 0) return this.update(person); else return this.create(person);
    }

    public async create(person: Person) {
        const birthDate = DateTimeHelper.toMysqlDate(person.birthDate);
        const anniversary = DateTimeHelper.toMysqlDate(person.anniversary);
        const photoUpdated = DateTimeHelper.toMysqlDate(person.photoUpdated);
        return DB.query(
            "INSERT INTO people (churchId, userId, displayName, firstName, middleName, lastName, nickName, prefix, suffix, birthDate, gender, maritalStatus, anniversary, membershipStatus, homePhone, mobilePhone, workPhone, email, address1, address2, city, state, zip, photoUpdated, householdId, householdRole, removed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);",
            [
                person.churchId, person.userId,
                person.name.display, person.name.first, person.name.middle, person.name.last, person.name.nick, person.name.prefix, person.name.suffix,
                birthDate, person.gender, person.maritalStatus, anniversary, person.membershipStatus,
                person.contactInfo.homePhone, person.contactInfo.mobilePhone, person.contactInfo.workPhone, person.contactInfo.email, person.contactInfo.address1, person.contactInfo.address2, person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip,
                photoUpdated, person.householdId, person.householdRole
            ]
        ).then((row: any) => { person.id = row.insertId; return person; });
    }

    public async update(person: Person) {
        const birthDate = DateTimeHelper.toMysqlDate(person.birthDate);
        const anniversary = DateTimeHelper.toMysqlDate(person.anniversary);
        const photoUpdated = DateTimeHelper.toMysqlDate(person.photoUpdated);
        return DB.query(
            "UPDATE people SET userId=?, displayName=?, firstName=?, middleName=?, lastName=?, nickName=?, prefix=?, suffix=?, birthDate=?, gender=?, maritalStatus=?, anniversary=?, membershipStatus=?, homePhone=?, mobilePhone=?, workPhone=?, email=?, address1=?, address2=?, city=?, state=?, zip=?, photoUpdated=?, householdId=?, householdRole=? WHERE id=? and churchId=?",
            [
                person.userId,
                person.name.display, person.name.first, person.name.middle, person.name.last, person.name.nick, person.name.prefix, person.name.suffix,
                birthDate, person.gender, person.maritalStatus, anniversary, person.membershipStatus,
                person.contactInfo.homePhone, person.contactInfo.mobilePhone, person.contactInfo.workPhone, person.contactInfo.email, person.contactInfo.address1, person.contactInfo.address2, person.contactInfo.city, person.contactInfo.state, person.contactInfo.zip,
                photoUpdated, person.householdId, person.householdRole, person.id, person.churchId
            ]
        ).then(() => { return person });
    }

    public async updateHousehold(person: Person) {
        return DB.query("UPDATE people SET householdId=?, householdRole=? WHERE id=? and churchId=?", [person.householdId, person.householdRole, person.id, person.churchId])
            .then(() => { return person });
    }

    public async delete(churchId: number, id: number) {
        DB.query("UPDATE people SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM people WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
    }

    public async loadByIds(churchId: number, ids: number[]) {
        return DB.query("SELECT * FROM people WHERE id IN (" + ids.join(",") + ") AND churchId=?;", [churchId]);
    }

    public async loadByUserId(churchId: number, userId: number) {
        return DB.queryOne("SELECT * FROM people WHERE userId=? AND churchId=? AND removed=0;", [userId, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM people WHERE churchId=? AND removed=0;", [churchId]);
    }

    public async loadRecent(churchId: number) {
        return DB.query("SELECT * FROM (SELECT * FROM people WHERE churchId=? AND removed=0 order by id desc limit 25) people ORDER BY lastName, firstName;", [churchId]);
    }

    public async loadByHousehold(churchId: number, householdId: number) {
        return DB.query("SELECT * FROM people WHERE churchId=? and householdId=? AND removed=0;", [churchId, householdId]);
    }

    public async loadByUserIds(churchId: number, userIds: number[]) {
        return DB.query("SELECT * FROM people WHERE userId IN (" + userIds.join(",") + ") AND churchId=? AND removed=0;", [churchId]);
    }

    public async search(churchId: number, term: string) {
        return DB.query(
            "SELECT * FROM people WHERE churchId=? AND concat(IFNULL(FirstName,''), ' ', IFNULL(MiddleName,''), ' ', IFNULL(NickName,''), ' ', IFNULL(LastName,'')) LIKE ? AND removed=0 LIMIT 100;",
            [churchId, "%" + term.replace(" ", "%") + "%"]
        );
    }

    public async searchPhone(churchId: number, phoneNumber: string) {
        const phoneSearch = "%" + phoneNumber.replace(" ", "%") + "%";
        return DB.query(
            "SELECT * FROM people WHERE churchId=? AND (REPLACE(HomePhone,'-','') LIKE ? OR REPLACE(WorkPhone,'-','') LIKE ? OR REPLACE(MobilePhone,'-','') LIKE ?) AND removed=0 LIMIT 100;",
            [churchId, phoneSearch, phoneSearch, phoneSearch]
        );
    }


    public async searchEmail(churchId: number, email: string) {
        return DB.query("SELECT * FROM people WHERE churchId=? AND email like ? AND removed=0 LIMIT 100;", [churchId, "%" + email + "%"]);
    }

    public async loadAttendees(churchId: number, campusId: number, serviceId: number, serviceTimeId: number, categoryName: string, groupId: number, startDate: Date, endDate: Date) {
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

        if (campusId > 0) { sql += " AND ser.campusId=?"; params.push(campusId); }
        if (serviceId > 0) { sql += " AND ser.id=?"; params.push(serviceId); }
        if (serviceTimeId > 0) { sql += " AND st.id=?"; params.push(serviceTimeId); }
        if (categoryName !== "") { sql += " AND g.categoryName=?"; params.push(categoryName); }
        if (groupId > 0) { sql += " AND g.id=?"; params.push(groupId); }
        sql += " GROUP BY p.id, p.displayName, p.firstName, p.lastName, p.photoUpdated";
        sql += " ORDER BY p.lastName, p.firstName";
        return DB.query(sql, params);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Person = {
            name: { display: data.displayName, first: data.firstName, last: data.lastName, middle: data.middleName, nick: data.nickName, prefix: data.prefix, suffix: data.suffix },
            contactInfo: { address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, homePhone: data.homePhone, workPhone: data.workPhone, email: data.email, mobilePhone: data.mobilePhone },
            photo: data.photo, anniversary: data.anniversary, birthDate: data.birthDate, gender: data.gender, householdId: data.householdId, householdRole: data.householdRole, maritalStatus: data.maritalStatus,
            membershipStatus: data.membershipStatus, photoUpdated: data.photoUpdated, id: data.id, userId: data.userId, importKey: data.importKey
        }
        if (result.photo === undefined) result.photo = PersonHelper.getPhotoUrl(churchId, result);
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Person[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
