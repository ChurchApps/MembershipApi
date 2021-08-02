import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Form } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class FormRepository {

    public save(form: Form) {
        return form.id ? this.update(form) : this.create(form);
    }

    private async create(form: Form) {
        form.id = UniqueIdHelper.shortId();
        const sql = "INSERT INTO forms (id, churchId, name, contentType, createdTime, modifiedTime, removed) VALUES (?, ?, ?, ?, NOW(), NOW(), 0);";
        const params = [form.id, form.churchId, form.name, form.contentType];
        await DB.query(sql, params);
        return form;
    }

    private async update(form: Form) {
        const sql = "UPDATE forms SET name=?, contentType=?, modifiedTime=NOW() WHERE id=? and churchId=?";
        const params = [form.name, form.contentType, form.id, form.churchId];
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
        return DB.query("SELECT * FROM forms WHERE churchId=? AND removed=0;", [churchId]);
    }

    public loadByIds(churchId: string, ids: string[]) {
        const quotedAndCommaSeparated = ids.length === 0 ? "" : "'" + ids.join("','") + "'";
        const sql = "SELECT * FROM forms WHERE churchId=? AND removed=0 AND id IN (" + quotedAndCommaSeparated + ") ORDER by name";
        return DB.query(sql, [churchId]);
    }


    public convertToModel(churchId: string, data: any) {
        const result: Form = { id: data.id, name: data.name, contentType: data.contentType, createdTime: data.createdTime, modifiedTime: data.modifiedTime };
        return result;
    }

    public convertAllToModel(churchId: string, data: any[]) {
        const result: Form[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
