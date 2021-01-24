import { ContactInfo } from './'
import { Name } from './'
import { FormSubmission } from '../apiBase/models';

export class Person {
    public id?: number;
    public churchId?: number;
    public userId?: number;
    public name?: Name;
    public contactInfo?: ContactInfo;
    public birthDate?: Date;
    public gender?: string;
    public maritalStatus?: string;
    public anniversary?: Date;
    public membershipStatus?: string;
    public householdId?: number;
    public householdRole?: string;
    public photoUpdated?: Date;
    public photo?: string;
    public importKey?: string;

    public formSubmissions?: FormSubmission[];
}
