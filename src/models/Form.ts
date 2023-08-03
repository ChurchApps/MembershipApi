import { Question } from "./";

export class Form {
    public id?: string;
    public churchId?: string;
    public name?: string;
    public contentType?: string;
    public createdTime?: Date;
    public modifiedTime?: Date;
    public accessStartTime?: Date;
    public accessEndTime?: Date;
    public restricted?: boolean;
    public questions?: Question[];
    public archived?: boolean;
    public action?: string;
}
