export class Group {
  public id?: string;
  public churchId?: string;
  public categoryName?: string;
  public name?: string;
  public trackAttendance?: boolean;
  public parentPickup?: false;
  public printNametag?: boolean;
  public about?: string;
  public photoUrl?: string;
  public tags?: string;
  public meetingTime?: string;
  public meetingLocation?: string;
  public labels?: string;
  public labelArray?: string[];
  public slug?: string;

  public memberCount?: number;
  public importKey?: string;
}
