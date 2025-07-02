import { controller, httpPost, httpGet, requestParam, httpDelete } from "inversify-express-utils";
import { Role } from "../models";
import express from "express";
import { AuthenticatedUser } from "../auth";
import { MembershipBaseController } from "./MembershipBaseController";
import { Permissions, IPermission } from "../helpers";

@controller("/roles")
export class RoleController extends MembershipBaseController {
  @httpGet("/church/:churchId")
  public async loadByChurchId(
    @requestParam("churchId") churchId: string,
    req: express.Request<{}, {}, []>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.roles.view)) return this.json({}, 401);
      else {
        return this.repositories.role.convertAllToModel(
          churchId,
          await this.repositories.role.loadByChurchId(churchId)
        );
      }
    });
  }

  @httpGet("/:id")
  public async loadById(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, []>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const role: Role = await this.repositories.role.loadById(au.churchId, id);
      const roles: Role[] = [role];
      const hasAccess = await this.checkAccess(roles, Permissions.roles.view, au);
      if (!hasAccess) return this.json({}, 401);
      else return this.json(role, 200);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Role[]>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.roles.edit)) return this.json({}, 401);
      else {
        let roles: Role[] = req.body;
        const promises: Promise<Role>[] = [];
        roles.forEach((role) => {
          role.churchId = au.churchId;
          promises.push(this.repositories.role.save(role));
        });
        roles = await Promise.all(promises);
        return this.json(roles, 200);
      }
    });
  }

  @httpDelete("/:id")
  public async delete(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, []>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const role: Role = await this.repositories.role.loadById(au.churchId, id);
      const roles: Role[] = [role];
      if (!this.checkAccess(roles, Permissions.roles.edit, au)) return this.json({}, 401);
      else {
        await this.repositories.rolePermission.deleteForRole(au.churchId, id);
        await this.repositories.roleMember.deleteForRole(au.churchId, id);
        await new Promise((resolve) => setTimeout(resolve, 500)); // I think it takes a split second for the FK restraints to see the members were deleted sometimes and the delete below fails if I don't wait.
        await this.repositories.role.delete(au.churchId, id);
        return this.json([], 200);
      }
    });
  }

  private async checkAccess(roles: Role[], permission: IPermission, au: AuthenticatedUser) {
    const hasAccess = au.checkAccess(permission);
    if (hasAccess && au.apiName !== "AccessManagement") {
      // roles.forEach(r => { if (r.appName !== au.appName) hasAccess = false; })
    }
    return hasAccess;
  }
}
