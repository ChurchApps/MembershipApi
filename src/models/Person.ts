import { ContactInfo } from "./ContactInfo";
import { Name } from "./Name";
import { FormSubmission } from "../models/FormSubmission";

export class Person {
  public id?: string;
  public churchId?: string;
  public name?: Name;
  public contactInfo?: ContactInfo;
  public birthDate?: Date;
  public gender?: string;
  public maritalStatus?: string;
  public anniversary?: Date;
  public membershipStatus?: string;
  public householdId?: string;
  public householdRole?: string;
  public photoUpdated?: Date;
  public photo?: string;
  public importKey?: string;
  public removed?: boolean;
  public conversationId?: string;
  public optedOut?: boolean;
  public nametagNotes?: string;
  public formSubmissions?: FormSubmission[];
  public email?: string;
}
