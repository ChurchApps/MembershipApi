import { injectable } from "inversify";
import { DB } from "@churchapps/apihelper";
import { VisibilityPreference } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class VisibilityPreferenceRepository {

  public save(preference: VisibilityPreference) {
    return preference.id ? this.update(preference) : this.create(preference);
  }

  private async create(preference: VisibilityPreference) {
    preference.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO visibilityPreferences (id, churchId, personId, address, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?);";
    const params = [preference.id, preference.churchId, preference.personId, preference.address, preference.phoneNumber, preference.email];
    await DB.query(sql, params);
    return preference;
  }

  private async update(preference: VisibilityPreference) {
    const sql = "UPDATE visibilityPreferences SET personId=?, address=?, phoneNumber=?, email=? WHERE id=? AND churchId=?;";
    const params = [preference.personId, preference.address, preference.phoneNumber, preference.email, preference.id, preference.churchId];
    await DB.query(sql, params);
    return preference;
  }

  public async loadForPerson(churchId: string, personId: string) {
    const sql = "SELECT * FROM visibilityPreferences WHERE churchId=? AND personId=?;";
    return DB.query(sql, [churchId, personId]);
  }

  public async loadAll(churchId: string) {
    return DB.query("SELECT * FROM visibilityPreferences WHERE churchId=?;", [churchId]);
  }
}
