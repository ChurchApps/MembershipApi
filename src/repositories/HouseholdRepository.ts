import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Household } from "../models";

@injectable()
export class HouseholdRepository {

    public async save(household: Household) {
        if (household.id > 0) return this.update(household); else return this.create(household);
    }

    public async create(household: Household) {
        return DB.query(
            "INSERT INTO households (churchId, name) VALUES (?, ?);",
            [household.churchId, household.name]
        ).then((row: any) => { household.id = row.insertId; return household; });
    }

    public async update(household: Household) {
        return DB.query(
            "UPDATE households SET name=? WHERE id=? and churchId=?",
            [household.name, household.id, household.churchId]
        ).then(() => { return household });
    }

    public async deleteUnused(churchId: number) {
        return DB.query("DELETE FROM households WHERE churchId=? AND id not in (SELECT householdId FROM people WHERE churchId=? AND householdId IS NOT NULL group by householdId)", [churchId, churchId]);
    }

    public async delete(churchId: number, id: number) {
        DB.query("DELETE FROM households WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async load(churchId: number, id: number) {
        return DB.queryOne("SELECT * FROM households WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public async loadAll(churchId: number) {
        return DB.query("SELECT * FROM households WHERE churchId=?;", [churchId]);
    }

    public convertToModel(churchId: number, data: any) {
        const result: Household = { id: data.id, name: data.name };
        return result;
    }

    public convertAllToModel(churchId: number, data: any[]) {
        const result: Household[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
