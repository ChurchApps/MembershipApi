import { DB } from "@churchapps/apihelper";
import { Church, Api, LoginUserChurch } from "../models";
import { UniqueIdHelper } from "../helpers";

export class ChurchRepository {

  public async loadCount() {
    const data = await DB.queryOne("SELECT COUNT(*) as count FROM churches", []);
    return parseInt(data.count, 0);
  }

  public loadAll() {
    return DB.query("SELECT * FROM churches WHERE archivedDate IS NULL ORDER BY name", []).then((rows: Church[]) => { return rows; });
  }

  public search(name: string, includeArchived: boolean) {
    let query = "SELECT * FROM churches WHERE name like ?";
    const params = ["%" + name.replace(" ", "%") + "%"];
    if (!includeArchived) query += "AND archivedDate IS NULL";
    query += " ORDER BY name";
    if (name) query += " LIMIT 50";
    else query += " LIMIT 10";
    return DB.query(query, params).then((rows: Church[]) => { return rows; });
  }

  public loadContainingSubDomain(subDomain: string) {
    return DB.query("SELECT * FROM churches WHERE subDomain like ? and archivedDate IS NULL;", [subDomain + "%"]);
  }

  public loadBySubDomain(subDomain: string) {
    return DB.queryOne("SELECT * FROM churches WHERE subDomain=? and archivedDate IS NULL;", [subDomain]);
  }

  public loadById(id: string) {
    return DB.queryOne("SELECT * FROM churches WHERE id=?;", [id]);
  }

  public loadByIds(ids: string[]) {
    return DB.query("SELECT * FROM churches WHERE id IN (?) order by name;", [ids]);
  }

  public async loadForUser(userId: string) {
    const sql = "select c.*, uc.personId, p.membershipStatus from userChurches uc "
      + " inner join churches c on c.id=uc.churchId and c.archivedDate IS NULL"
      + " LEFT JOIN people p on p.id=uc.personId"
      + " where uc.userId=?";
    const rows = await DB.query(sql, [userId]);
    const result: LoginUserChurch[] = [];
    rows.forEach((row: any) => {
      const apis: Api[] = [];
      const addChurch = { church: { id: row.id, name: row.churchName, subDomain: row.subDomain }, person: { id: row.personId, membershipStatus: row.membershipStatus }, apis };
      result.push(addChurch);
    });
    return result;
  }

  public async getAbandoned(noMonths = 6) {
    const sql = "SELECT churchId FROM (SELECT churchId, MAX(lastAccessed) lastAccessed FROM userChurches GROUP BY churchId) groupedChurches WHERE lastAccessed <= DATE_SUB(NOW(), INTERVAL " + noMonths + " MONTH);";
    const rows = await DB.query(sql, []);
    return rows;
  }

  public async deleteAbandoned(noMonths = 7) {
    const sql = "DELETE churches FROM churches LEFT JOIN (SELECT churchId, MAX(lastAccessed) lastAccessed FROM userChurches GROUP BY churchId) groupedChurches ON churches.id = groupedChurches.churchId WHERE groupedChurches.lastAccessed <= DATE_SUB(NOW(), INTERVAL " + noMonths + " MONTH);";
    return await DB.query(sql, []);
  }

  public save(church: Church) {
    return church.id ? this.update(church) : this.create(church);
  }

  private async create(church: Church) {
    church.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO churches (id, name, subDomain, registrationDate, address1, address2, city, state, zip, country, archivedDate, latitude, longitude) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    const params = [church.id, church.name, church.subDomain, church.address1, church.address2, church.city, church.state, church.zip, church.country, church.archivedDate, church.latitude, church.longitude];
    await DB.query(sql, params);
    return church;
  }

  private async update(church: Church) {
    const sql = "UPDATE churches SET name=?, subDomain=?, address1=?, address2=?, city=?, state=?, zip=?, country=?, archivedDate=?, latitude=?, longitude=? WHERE id=?;";
    const params = [church.name, church.subDomain, church.address1, church.address2, church.city, church.state, church.zip, church.country, church.archivedDate, church.latitude, church.longitude, church.id];
    await DB.query(sql, params);
    return church;
  }


  public convertToModel(data: any) {
    const result: Church = { id: data.id, name: data.name, address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, country: data.country, registrationDate: data.registrationDate, subDomain: data.subDomain, archivedDate: data.archivedDate, latitude: data.latitude, longitude: data.longitude };
    return result;
  }

  public convertAllToModel(data: any[]) {
    const result: Church[] = [];
    data.forEach(d => result.push(this.convertToModel(d)));
    return result;
  }


}
