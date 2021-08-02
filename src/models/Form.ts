import { Question } from "./";

export class Form {
    public id?: string;
    public churchId?: string;
    public name?: string;
    public contentType?: string;
    public createdTime?: Date;
    public modifiedTime?: Date;

    public questions?: Question[]
}
