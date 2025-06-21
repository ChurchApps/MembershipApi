import { ApiName, ContentType, Actions } from "../helpers";

export class RolePermission {
  public id?: string;
  public churchId?: string;
  public roleId?: string;
  public apiName?: ApiName;
  public contentType?: ContentType;
  public contentId?: string;
  public action?: Actions;

  constructor({ churchId, roleId, apiName, contentType, contentId, action }: RolePermission) {
    this.churchId = churchId;
    this.roleId = roleId;
    this.apiName = apiName;
    this.contentType = contentType;
    this.contentId = contentId;
    this.action = action;
  }
}
