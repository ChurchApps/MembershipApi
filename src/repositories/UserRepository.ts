import { DB } from "@churchapps/apihelper";
import { User } from "../models";
import { UniqueIdHelper, DateHelper } from "../helpers";

export class UserRepository {

  public save(user: User) {
    return user.id ? this.update(user) : this.create(user);
  }

  private async create(user: User) {
    user.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO users (id, email, password, authGuid, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?);";
    const params = [user.id, user.email, user.password, user.authGuid, user.firstName, user.lastName];
    await DB.query(sql, params);
    return user;
  }

  private async update(user: User) {
    const registrationDate = DateHelper.toMysqlDate(user.registrationDate);
    const lastLogin = DateHelper.toMysqlDate(user.lastLogin);
    const sql = "UPDATE users SET email=?, password=?, authGuid=?, firstName=?, lastName=?, registrationDate=?, lastLogin=? WHERE id=?;";
    const params = [user.email, user.password, user.authGuid, user.firstName, user.lastName, registrationDate, lastLogin, user.id];
    await DB.query(sql, params);
    return user;
  }


  public load(id: string): Promise<User> {
    return DB.queryOne("SELECT * FROM users WHERE id=?", [id]);
  }

  public loadByEmail(email: string): Promise<User> {
    return DB.queryOne("SELECT * FROM users WHERE email=?", [email]);
  }

  public loadByAuthGuid(authGuid: string): Promise<User> {
    return DB.queryOne("SELECT * FROM users WHERE authGuid=?", [authGuid]);
  }

  public loadByEmailPassword(email: string, hashedPassword: string): Promise<User> {
    return DB.queryOne("SELECT * FROM users WHERE email=? AND password=?", [email, hashedPassword]);
  }

  public loadByIds(ids: string[]): Promise<User[]> {
    return DB.query("SELECT * FROM users WHERE id IN (?)", [ids]);
  }

  public delete(id: string) {
    return DB.query("DELETE FROM users WHERE id=?", [id]);
  }

  public async loadCount() {
    const data = await DB.queryOne("SELECT COUNT(*) as count FROM users", []);
    return parseInt(data.count, 0);
  }

}
