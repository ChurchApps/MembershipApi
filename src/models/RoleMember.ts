import { User } from "./";

export class RoleMember {
  public id?: string;
  public churchId?: string;
  public roleId?: string;
  public userId?: string;
  public dateAdded?: Date;
  public addedBy?: string;

  public user?: User;
}
