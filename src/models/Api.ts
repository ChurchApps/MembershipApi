import { RolePermission } from "./RolePermission";

export class Api {
  public id?: string;
  public keyName?: string;
  public name?: string;
  public permissions?: RolePermission[];
  public jwt?: string;
}
