import { Form, Answer, Question } from "./";

export class FormSubmission {
    public id?: string;
    public churchId?: string;
    public formId?: string;
    public contentType?: string;
    public contentId?: string;
    public submissionDate?: Date;
    public submittedBy?: string;
    public revisionDate?: Date;
    public revisedBy?: string;

    public form?: Form;
    public questions?: Question[];
    public answers?: Answer[];
}
