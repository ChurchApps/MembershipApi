import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Domain } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class DomainRepository {

  public save(domain: Domain) {
    return domain.id ? this.update(domain) : this.create(domain);
  }

  private async create(domain: Domain) {
    domain.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO `domains` (id, churchId, domainName) VALUES (?, ?, ?);";
    const params = [domain.id, domain.churchId, domain.domainName];
    await DB.query(sql, params);
    return domain;
  }

  private async update(domain: Domain) {
    const sql = "UPDATE `domains` SET domainName=? WHERE id=? and churchId=?";
    const params = [domain.domainName, domain.id, domain.churchId];
    await DB.query(sql, params);
    return domain;
  }

  public delete(churchId: string, id: string) {
    return DB.query("DELETE FROM `domains` WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM `domains` WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public loadByName(domainName: string) {
    return DB.queryOne("SELECT * FROM `domains` WHERE domainName=?;", [domainName]);
  }

  public loadAll(churchId: string) {
    return DB.query("SELECT * FROM `domains` WHERE churchId=? ORDER by domainName;", [churchId]);
  }

  public loadPairs() {
    return DB.query("select d.domainName as host, concat(c.subDomain, '.b1.church:443') as dial from domains d inner join churches c on c.id=d.churchId;", []);
  }

  public loadByIds(churchId: string, ids: string[]) {
    const sql = "SELECT * FROM `domains` WHERE churchId=? AND id IN (" + ids.join(",") + ") ORDER by name";
    return DB.query(sql, [churchId]);
  }

}
