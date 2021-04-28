import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Household } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class HouseholdRepository {

    public save(household: Household) {
        if (UniqueIdHelper.isMissing(household.id)) return this.create(household); else return this.update(household);
    }

    public async create(household: Household) {
        household.id = UniqueIdHelper.shortId();
        const sql = "INSERT INTO households (id, churchId, name) VALUES (?, ?, ?);";
        const params = [household.id, household.churchId, household.name];
        await DB.query(sql, params);
        return household;
    }

    public async update(household: Household) {
        const sql = "UPDATE households SET name=? WHERE id=? and churchId=?";
        const params = [household.name, household.id, household.churchId];
        await DB.query(sql, params);
        return household;
    }

    public deleteUnused(churchId: string) {
        return DB.query("DELETE FROM households WHERE churchId=? AND id not in (SELECT householdId FROM people WHERE churchId=? AND householdId IS NOT NULL group by householdId)", [churchId, churchId]);
    }

    public delete(churchId: string, id: string) {
        return DB.query("DELETE FROM households WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public load(churchId: string, id: string) {
        return DB.queryOne("SELECT * FROM households WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public loadAll(churchId: string) {
        return DB.query("SELECT * FROM households WHERE churchId=?;", [churchId]);
    }

    public convertToModel(churchId: string, data: any) {
        const result: Household = { id: data.id, name: data.name };
        return result;
    }

    public convertAllToModel(churchId: string, data: any[]) {
        const result: Household[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
