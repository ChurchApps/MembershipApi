import { DB } from "../apiBase/db";
import { RolePermission, Church, Api, UserChurch, LoginUserChurch } from "../models";
import { UniqueIdHelper } from "../helpers";
import { ArrayHelper } from "../apiBase";

export class RolePermissionRepository {

  public save(rolePermission: RolePermission) {
    return rolePermission.id ? this.update(rolePermission) : this.create(rolePermission)
  }

  private async create(rolePermission: RolePermission) {
    rolePermission.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO rolePermissions (id, churchId, roleId, apiName, contentType, contentId, action) VALUES (?, ?, ?, ?, ?, ?, ?);";
    const params = [rolePermission.id, rolePermission.churchId, rolePermission.roleId, rolePermission.apiName, rolePermission.contentType, rolePermission.contentId, rolePermission.action];
    await DB.query(sql, params);
    return rolePermission;
  }

  private async update(rolePermission: RolePermission) {
    const sql = "UPDATE rolePermissions SET roleId=?, apiName=?, contentType=?, contentId=?, action=? WHERE id=? AND churchId=?";
    const params = [rolePermission.roleId, rolePermission.apiName, rolePermission.contentType, rolePermission.contentId, rolePermission.action, rolePermission.id, rolePermission.churchId];
    await DB.query(sql, params);
    return rolePermission;
  }

  public deleteForRole(churchId: string, roleId: string) {
    const sql = "DELETE FROM rolePermissions WHERE churchId=? AND roleId=?"
    const params = [churchId, roleId];
    return DB.query(sql, params);
  }

  public delete(churchId: string, id: string) {
    const sql = "DELETE FROM rolePermissions WHERE churchId=? AND id=?"
    const params = [churchId, id];
    return DB.query(sql, params);
  }

  public async deleteForUser(userId: string) {
    const query = "DELETE rm, rp, uc FROM rolemembers rm INNER JOIN roles r on r.id=rm.roleId INNER JOIN rolePermissions rp on (rp.roleId=r.id or (rp.roleId IS NULL AND rp.churchId=rm.churchId)) LEFT JOIN userChurches uc on uc.churchId=r.churchId AND uc.userId = rm.userId WHERE rm.userId=?"
    return DB.query(query, [userId])
  }

  public async loadForUser(userId: string, removeUniversal: boolean): Promise<LoginUserChurch[]> {
    const query = "SELECT c.name AS churchName, r.churchId, c.subDomain, rp.apiName, rp.contentType, rp.contentId, rp.action, uc.personId AS personId, p.membershipStatus, c.archivedDate"
      + " FROM roleMembers rm"
      + " INNER JOIN roles r on r.id=rm.roleId"
      + " INNER JOIN rolePermissions rp on (rp.roleId=r.id or (rp.roleId IS NULL AND rp.churchId=rm.churchId))"
      + " LEFT JOIN churches c on c.id=r.churchId"
      + " LEFT JOIN userChurches uc on uc.churchId=r.churchId AND uc.userId = rm.userId"
      + " LEFT JOIN people p on p.id = uc.personId AND p.churchId=uc.churchId"
      + " WHERE rm.userId=?"
      + " GROUP BY c.name, r.churchId, rp.apiName, rp.contentType, rp.contentId, rp.action, uc.personId, p.membershipStatus, c.archivedDate"
      + " ORDER BY c.name, r.churchId, rp.apiName, rp.contentType, rp.contentId, rp.action, uc.personId, p.membershipStatus, c.archivedDate";
    const data = await DB.query(query, [userId]);

    const result: LoginUserChurch[] = [];
    let currentUserChurch: LoginUserChurch = null;
    let currentApi: Api = null;
    let reportingApi: Api = null;
    data.forEach((row: any) => {
      if (currentUserChurch === null || row.churchId !== currentUserChurch.church.id) {
        currentUserChurch = { church: { id: row.churchId, name: row.churchName, subDomain: row.subDomain, archivedDate: row.archivedDate }, person: { id: row.personId, membershipStatus: row.membershipStatus }, apis: [] };
        result.push(currentUserChurch);
        currentApi = null;
        reportingApi = { keyName: "ReportingApi", permissions: [] }
        currentUserChurch.apis.push(reportingApi);
      }
      if (currentApi === null || row.apiName !== currentApi.keyName) {
        currentApi = { keyName: row.apiName, permissions: [] };
        currentUserChurch.apis.push(currentApi);
      }

      const permission: RolePermission = { action: row.action, contentId: row.contentId, contentType: row.contentType }
      currentApi.permissions.push(permission);

      const reportingPermission = { ...permission, apiName: row.apiName };
      reportingApi.permissions.push(reportingPermission);

    });

    if (result.length > 0 && this.applyUniversal(result) && removeUniversal) result.splice(0, 1);

    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i].church.archivedDate) result.splice(i, 1);
    }

    return result;
  }

  public async loadForChurch(churchId: string, univeralChurch: LoginUserChurch): Promise<LoginUserChurch> {
    const query = "SELECT c.name AS churchName, r.churchId, c.subDomain, rp.apiName, rp.contentType, rp.contentId, rp.action"
      + " FROM roles r"
      + " INNER JOIN rolePermissions rp on rp.roleId=r.id"
      + " LEFT JOIN churches c on c.id=r.churchId"
      + " WHERE c.id=?"
      + " GROUP BY c.name, r.churchId, rp.apiName, rp.contentType, rp.contentId, rp.action"
      + " ORDER BY c.name, r.churchId, rp.apiName, rp.contentType, rp.contentId, rp.action";
    const data = await DB.query(query, [churchId])
    let result: LoginUserChurch = null;
    let currentApi: Api = null;
    data.forEach((row: any) => {
      if (result === null) {
        result = { church: { id: row.churchId, subDomain: row.subDomain, name: row.churchName }, person: {}, apis: [] };
        currentApi = null;
      }

      if (currentApi === null || row.apiName !== currentApi.keyName) {
        currentApi = { keyName: row.apiName, permissions: [] };
        result.apis.push(currentApi);
        // Apply universal permissions
        if (univeralChurch !== null) univeralChurch.apis.forEach(universalApi => { if (universalApi.keyName === currentApi.keyName) universalApi.permissions.forEach(perm => { currentApi.permissions.push(perm) }); });

      }

      const permission: RolePermission = { action: row.action, contentId: row.contentId, contentType: row.contentType }
      currentApi.permissions.push(permission);
    });
    /*
        univeralChurch.apis.forEach(universalApi => {
          const api = ArrayHelper.getOne(result.apis, "keyName", universalApi.keyName);
          if (api === null) result.apis.push(universalApi);
          else {
            universalApi.permissions.forEach(perm => { api.permissions.push(perm) });
          }
        });
    */
    return result;
  }

  public async loadUserPermissionInChurch(userId: string, churchId: string) {
    const query = "SELECT c.name AS churchName, r.churchId, c.subDomain, rp.apiName, rp.contentType, rp.contentId, rp.action"
      + " FROM roleMembers rm"
      + " INNER JOIN roles r on r.id=rm.roleId"
      + " INNER JOIN rolePermissions rp on (rp.roleId=r.id or (rp.roleId IS NULL AND rp.churchId=rm.churchId))"
      + " LEFT JOIN churches c on c.id=r.churchId"
      + " WHERE rm.userId=? AND rm.churchId=?"
      + " GROUP BY c.name, r.churchId, rp.apiName, rp.contentType, rp.contentId, rp.action"
      + " ORDER BY c.name, r.churchId, rp.apiName, rp.contentType, rp.contentId, rp.action";
    const data = await DB.query(query, [userId, churchId]);

    let result: LoginUserChurch = null;
    let currentApi: Api = null;

    data.forEach((row: any) => {
      if (result === null) {
        result = { church: { id: row.churchId, subDomain: row.subDomain, name: row.churchName }, person: {}, apis: [] };
        currentApi = null;
      }

      if (currentApi === null || row.apiName !== currentApi.keyName) {
        currentApi = { keyName: row.apiName, permissions: [] };
        result.apis.push(currentApi);
      }

      const permission: RolePermission = { action: row.action, contentId: row.contentId, contentType: row.contentType }
      currentApi.permissions.push(permission);
    });

    return result;
  }

  // Apply site admin priviledges that aren't tied to a specific church.
  private applyUniversal(userChurches: LoginUserChurch[]) {
    if (userChurches[0].church.id !== "0") return false;
    for (let i = 1; i < userChurches.length; i++) {
      const currentUserChurch = userChurches[i];

      userChurches[0].apis.forEach(universalApi => {
        const api = ArrayHelper.getOne(currentUserChurch.apis, "keyName", universalApi.keyName);
        if (api === null) currentUserChurch.apis.push({ ...universalApi });
        else {
          universalApi.permissions.forEach(perm => { api.permissions.push(perm) });
        }
      });
    }
    return true;
  }

  public loadByRoleId(churchId: string, roleId: string): Promise<RolePermission[]> {
    return DB.query("SELECT * FROM rolePermissions WHERE churchId=? AND roleId=?", [churchId, roleId]);
  }

  // permissions applied to all the members of church
  public loadForEveryone(churchId: string) {
    return DB.query("SELECT rp.id, rp.churchId, rp.roleId, rp.apiName, rp.contentType, rp.contentId, rp.action, c.name AS churchName, c.subDomain FROM rolePermissions rp LEFT JOIN churches c on c.id=rp.churchId WHERE rp.churchId=? AND rp.roleId IS NULL", [churchId]);
  }

}
