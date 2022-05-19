import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Question } from "../apiBase/models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class QuestionRepository {

    public save(question: Question) {
        return question.id ? this.update(question) : this.create(question);
    }

    private async create(question: Question) {
        question.id = UniqueIdHelper.shortId();
        const sql = "INSERT INTO questions (id, churchId, formId, parentId, title, description, fieldType, placeholder, sort, required, choices, removed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);";
        const params = [question.id, question.churchId, question.formId, question.parentId, question.title, question.description, question.fieldType, question.placeholder, question.sort, question.required, JSON.stringify(question.choices)];
        await DB.query(sql, params);
        return question;
    }

    private async update(question: Question) {
        const sql = "UPDATE questions SET formId=?, parentId=?, title=?, description=?, fieldType=?, placeholder=?, sort=?, required=?, choices=? WHERE id=? and churchId=?";
        const params = [question.formId, question.parentId, question.title, question.description, question.fieldType, question.placeholder, question.sort, question.required, JSON.stringify(question.choices), question.id, question.churchId];
        await DB.query(sql, params);
        return question;
    }

    public delete(churchId: string, id: string) {
        return DB.query("UPDATE questions SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
    }

    public load(churchId: string, id: string) {
        return DB.queryOne("SELECT * FROM questions WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
    }

    public loadAll(churchId: string) {
        return DB.query("SELECT * FROM questions WHERE churchId=? AND removed=0;", [churchId]);
    }

    public loadForForm(churchId: string, formId: string) {
        return DB.query("SELECT * FROM questions WHERE churchId=? AND formId=? AND removed=0 ORDER BY sort;", [churchId, formId]);
    }

    public loadForUnrestrictedForm(formId: string) {
        return DB.query("SELECT * FROM questions WHERE formId=? AND removed=0;", [formId]);
    }

    public async moveQuestionUp(id: string) {
        const question = await DB.queryOne("SELECT formId, sort FROM questions WHERE id=?", [id]);
        let result = await DB.query("UPDATE questions SET sort=sort+1 WHERE formId=? AND sort=?;", [question.formId, +question.sort-1]);
        result = await DB.query("UPDATE questions SET sort=sort-1 WHERE id=?;", [id]);
    }

    public async moveQuestionDown(id: string) {
        const question = await DB.queryOne("SELECT formId, sort FROM questions WHERE id=?", [id]);
        let result = await DB.query("UPDATE questions SET sort=sort-1 WHERE formId=? AND sort=?;", [question.formId, +question.sort+1]);
        result = await DB.query("UPDATE questions SET sort=sort+1 WHERE id=?;", [id]);
    }

    public convertToModel(churchId: string, data: any) {
        const result: Question = { id: data.id, formId: data.formId, parentId: data.parentId, title: data.title, description: data.description, fieldType: data.fieldType, placeholder: data.placeholder, required: data.required, sort: data.sort };
        if (typeof data.choices === "string") result.choices = JSON.parse(data.choices);
        else result.choices = data.choices;
        return result;
    }

    public convertAllToModel(churchId: string, data: any[]) {
        const result: Question[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }

}
