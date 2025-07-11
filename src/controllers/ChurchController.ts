import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import {
  RegistrationRequest,
  Church,
  RolePermission,
  Api,
  RegisterChurchRequest,
  LoginUserChurch,
  Group,
  RoleMember,
  User
} from "../models";
import express from "express";
import { body, validationResult } from "express-validator";
import { AuthenticatedUser } from "../auth";
import { MembershipBaseController } from "./MembershipBaseController";
import {
  Utils,
  Permissions,
  ChurchHelper,
  RoleHelper,
  Environment,
  HubspotHelper,
  GeoHelper,
  PersonHelper,
  UserHelper
} from "../helpers";
import { Repositories } from "../repositories";
import { ArrayHelper, EmailHelper } from "@churchapps/apihelper";

const churchRegisterValidation = [
  body("name").notEmpty().withMessage("Select a church name"),
  body("address1").notEmpty().withMessage("Enter an address"),
  body("city").notEmpty().withMessage("Enter a city"),
  body("state").notEmpty().withMessage("Select a state"),
  body("zip").notEmpty().withMessage("Enter a zip"),
  body("country").notEmpty().withMessage("Enter a country")
];

@controller("/churches")
export class ChurchController extends MembershipBaseController {
  @httpGet("/all")
  public async loadAll(req: express.Request<{}, {}, []>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.server.admin)) return this.json({}, 401);
      let term: string = req.query.term.toString();
      if (term === null) term = "";
      const data = await this.repositories.church.search(term, true);
      const churches = this.repositories.church.convertAllToModel(data);
      return churches;
    });
  }

  @httpPost("/search")
  public async searchPost(
    req: express.Request<{}, {}, { name: string }>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    try {
      let result: Church[] = [];
      if (req.body.name !== undefined) {
        const data = await this.repositories.church.search(
          // decode URI encoded character e.g. replace %20 with ' '
          decodeURIComponent(
            // decode unicode characters '\uXXXX'
            JSON.parse(
              '"' +
                req.body.name
                  .toString()
                  // prepare unicode characters '\uXXXX' for decoding
                  .replace(/%u/g, "\\u") +
                '"'
            )
          ),
          false
        );
        result = this.repositories.church.convertAllToModel(data);
        await ChurchHelper.appendLogos(result);
        if (result.length > 0 && this.include(req, "favicon_400x400")) await this.appendLogos(result);
      }
      return this.json(result, 200);
    } catch (e) {
      this.logger.error(e);
      return this.internalServerError(e);
    }
  }

  @httpGet("/search/")
  public async search(req: express.Request<{}, {}, []>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    try {
      let result: Church[] = [];
      if (req.query.name !== undefined) {
        const app = req.query.app === undefined ? "" : req.query.app.toString();
        const data = await this.repositories.church.search(
          // decode URI encoded character e.g. replace %20 with ' '
          decodeURIComponent(
            // decode unicode characters '\uXXXX'
            JSON.parse(
              '"' +
                req.query.name
                  .toString()
                  // prepare unicode characters '\uXXXX' for decoding
                  .replace(/%u/g, "\\u") +
                '"'
            )
          ),
          false
        );
        result = this.repositories.church.convertAllToModel(data);
        await ChurchHelper.appendLogos(result);
        if (result.length > 0 && this.include(req, "favicon_400x400")) await this.appendLogos(result);
      }
      return this.json(result, 200);
    } catch (e) {
      this.logger.error(e);
      return this.internalServerError(e);
    }
  }

  @httpGet("/lookup/")
  public async getBySubDomain(
    req: express.Request<{}, {}, RegistrationRequest>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    try {
      let result = {};
      if (req.query.subDomain !== undefined) {
        const data = await this.repositories.church.loadBySubDomain(req.query.subDomain.toString());
        if (data) {
          const church = this.repositories.church.convertToModel(data);
          result = { id: church.id, name: church.name, subDomain: church.subDomain };
        }
      } else if (req.query.id !== undefined) {
        const data = await this.repositories.church.loadById(req.query.id.toString());
        if (data) {
          const church = this.repositories.church.convertToModel(data);
          result = { id: church.id, name: church.name, subDomain: church.subDomain };
        }
      }
      return this.json(result, 200);
    } catch (e) {
      this.logger.error(e);
      return this.internalServerError(e);
    }
  }

  @httpDelete("/deleteAbandoned")
  public async deleteAbandoned(req: express.Request<{}, {}, null>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.server.admin)) return this.json({}, 401);
      else {
        const churches = await this.repositories.church.deleteAbandoned(7);
        return this.json(churches, 200);
      }
    });
  }

  @httpGet("/test")
  public async test(req: express.Request<{}, {}, RegistrationRequest>, res: express.Response): Promise<any> {
    return this.actionWrapperAnon(req, res, async () => {
      HubspotHelper.register(
        "6",
        "Test Church6",
        "John",
        "Doe5",
        "123 Main St",
        "Anytown",
        "TX",
        "12345",
        "USA",
        "jdoe6@gmail.com",
        "Test App"
      );
      return this.json({ success: true }, 200);
    });
  }

  @httpGet("/:id")
  public async get(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, RegistrationRequest>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const data = await this.repositories.church.loadById(id);
      const church = this.repositories.church.convertToModel(data);
      return church;
    });
  }

  // This is just to get a church's server/domain admin without any permissions.
  @httpGet("/:id/getDomainAdmin")
  public async getDomainAdmin(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const roles = (await this.repositories.role.loadByChurchId(id)) as any[];
      const domainRole = ArrayHelper.getOne(roles, "name", "Domain Admins");
      const members = (await this.repositories.roleMember.loadByRoleId(domainRole.id, au.churchId)) as any[];
      let domainAdmin: RoleMember;
      if (members.length > 0) {
        const member: RoleMember = members[0];
        const user: User = (await this.repositories.user.load(member.userId)) as User;
        user.password = null;
        user.registrationDate = null;
        user.lastLogin = null;
        member.user = user;
        domainAdmin = member;
      }
      return domainAdmin;
    });
  }

  @httpGet("/:id/impersonate")
  public async impersonate(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, {}>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const churchId = id.toString();
      const hasAccess = au.checkAccess(Permissions.server.admin) || au.churchId === churchId;

      if (!hasAccess) return this.json({}, 401);
      else {
        const user = await this.repositories.user.load(au.id);

        let universalChurch = null;
        const churches = await this.repositories.rolePermission.loadForUser(au.id, false);
        churches.forEach((c) => {
          if (c.church.id === "0") universalChurch = c;
        });
        const result = await this.repositories.rolePermission.loadForChurch(churchId, universalChurch);

        // Make sure the impersonated church has domain admin permission
        const membershipApi = ArrayHelper.getOne(result.apis, "keyName", "MembershipApi");
        const domainAdmin = ArrayHelper.getOne(membershipApi.permissions, "contentType", "Domain");
        if (domainAdmin === null) {
          membershipApi.permissions.push({ contentType: "Domain", action: "Admin" });
        }

        UserHelper.replaceDomainAdminPermissions([result]);
        UserHelper.addAllReportingPermissions([result]);

        const churchWithAuth = await AuthenticatedUser.login([result], user);

        return churchWithAuth;
      }
    });
  }

  @httpGet("/")
  public async loadForUser(req: express.Request<{}, {}, []>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const churches = await this.repositories.rolePermission.loadForUser(au.id, true);
      return this.json(churches, 200);
    });
  }

  @httpPost("/byIds")
  public async loadByIds(req: express.Request<{}, {}, string[]>, res: express.Response): Promise<any> {
    return this.actionWrapperAnon(req, res, async () => {
      let result: Church[] = [];
      const ids = req.body;
      if (ids.length > 0) {
        const data = await this.repositories.church.loadByIds(ids);
        result = this.repositories.church.convertAllToModel(data);
      }
      return this.json(result, 200);
    });
  }

  static async validateSave(church: Church, repositories: Repositories) {
    const result: string[] = [];
    if (Utils.isEmpty(church.name)) result.push("Church name required");
    if (Utils.isEmpty(church.subDomain)) result.push("Subdomain required");
    else {
      if (/^([a-z0-9]{1,99})$/.test(church.subDomain) === false)
        result.push("Please enter only lower case letters and numbers for the subdomain.  Example: firstchurch");
      else {
        const c = await repositories.church.loadBySubDomain(church.subDomain);
        if (c !== null && c.id !== church.id) result.push("Subdomain unavailable");
      }
    }

    return result;
  }

  @httpPost("/:id/archive")
  public async archive(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, { archived: boolean }>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.server.admin)) return this.json({}, 401);
      else {
        const church = await this.repositories.church.loadById(id);
        if (req.body.archived) church.archivedDate = new Date();
        else church.archivedDate = null;
        await this.repositories.church.save(church);
        return this.json(church, 200);
      }
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Church[]>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.settings.edit)) return this.json({}, 401);
      else {
        const allErrors: string[] = [];
        let churches: Church[] = req.body;
        const promises: Promise<any>[] = [];
        churches.forEach((church) => {
          if (church.id !== au.churchId) return this.json({}, 401);
          else {
            const p = ChurchController.validateSave(church, this.repositories).then((errors) => {
              if (errors.length === 0) {
                promises.push(
                  this.repositories.church.save(church).then(async (ch) => {
                    await GeoHelper.updateChurchAddress(ch);
                    return ch;
                  })
                );
              } else allErrors.push(...errors);
            });
            promises.push(p);
          }
        });
        churches = await Promise.all(promises);
        if (allErrors.length > 0) return this.json({ errors: allErrors }, 401);
        else return this.json(churches, 200);
      }
    });
  }

  async validateRegister(church: Church, au: AuthenticatedUser) {
    const result: string[] = [];
    // Verify subdomain isn't taken
    if (church.subDomain) {
      if (/^([a-z0-9]{1,99})$/.test(church.subDomain) === false)
        result.push("Please enter only lower case letters and numbers for the subdomain.  Example: firstchurch");
      else {
        const c = await this.repositories.church.loadBySubDomain(church.subDomain);
        if (c !== null) {
          c.subDomain = c.subDomain + "2";
          // result.push("Subdomain unavailable");
          this.validateRegister(church, au);
        }
      }
    }
    return result;
  }

  @httpPost("/add", ...churchRegisterValidation)
  public async addChurch(req: express.Request<{}, {}, RegisterChurchRequest>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
      }

      let church = req.body;
      church.subDomain = await ChurchHelper.selectSubDomain(church.name);

      const errors = await this.validateRegister(church, au);
      if (errors.length > 0) return this.json({ errors }, 401);
      else {
        // create the church
        church = await this.repositories.church.save(church);

        // Configure church
        const instance = new RoleHelper(church.id, au.id);
        await instance.init(); // Setup roles and permissions

        if (Environment.emailOnRegistration) {
          await EmailHelper.sendTemplatedEmail(
            Environment.supportEmail,
            Environment.supportEmail,
            church.appName,
            null,
            "New Church Registration",
            "<h2>" + church.name + "</h2><h3>App: " + (church.appName || "unknown") + "</h3>"
          );
        }

        try {
          if (Environment.hubspotKey)
            await HubspotHelper.register(
              church.id,
              church.name,
              au.firstName,
              au.lastName,
              church.address1,
              church.city,
              church.state,
              church.zip,
              church.country,
              au.email,
              church.appName
            );
        } catch (_ex) {
          // Hubspot registration failed - continuing without error
        }
        return church;
      }
    });
  }

  private async appendLogos(churches: Church[]) {
    const ids = ArrayHelper.getIds(churches, "id");
    const settings = await this.repositories.setting.loadMulipleChurches(["favicon_400x400"], ids);
    (settings as any[]).forEach((s: any) => {
      const church = ArrayHelper.getOne(churches, "id", s.churchId);
      if (church.settings === undefined) church.settings = [];
      church.settings.push(s);
    });
  }

  // Used by select church modal after registration.
  // if both values (churchId and subDomain) are found in body, churchId will have first preference.
  @httpPost("/select")
  public async select(
    req: express.Request<{}, {}, { churchId: string; subDomain: string }>,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      let { churchId } = req.body;
      if (req.body.subDomain && !churchId) {
        const selectedChurch: Church = await this.repositories.church.loadBySubDomain(req.body.subDomain);
        churchId = selectedChurch.id;
      }
      const userChurch = await this.fetchChurchPermissions(au, churchId);
      const user = await this.repositories.user.load(au.id);

      const data = await AuthenticatedUser.login([userChurch], user);
      return this.json(data.userChurches[0], 200);
    });
  }

  private async appendPersonInfo(userChurch: LoginUserChurch, au: AuthenticatedUser, churchId: string) {
    const uc = (await PersonHelper.claim(au, churchId)).userChurch;
    const p = (await Repositories.getCurrent().person.load(uc.churchId, uc.personId)) as any;
    const groups: Group[] = (await this.repositories.group.loadForPerson(uc.personId)) as Group[];
    userChurch.person = { id: p.id, membershipStatus: p.membershipStatus };
    userChurch.groups = [];
    groups.forEach((g) => userChurch.groups.push({ id: g.id, tags: g.tags, name: g.name, leader: false }));
  }

  private async fetchChurchPermissions(au: AuthenticatedUser, churchId: string): Promise<LoginUserChurch> {
    // church includes user role permission and everyone permission.
    const userChurch = await this.repositories.rolePermission.loadUserPermissionInChurch(au.id, churchId);

    if (userChurch) {
      await this.appendPersonInfo(userChurch, au, churchId);
      return userChurch;
    }

    const everyonePermission = await this.repositories.rolePermission.loadForEveryone(churchId);
    let result: LoginUserChurch = null;
    let currentApi: Api = null;
    (everyonePermission as any[]).forEach((row: any) => {
      if (result === null) {
        result = { church: { id: row.churchId, subDomain: row.subDomain, name: row.churchName }, person: {}, apis: [] };
        currentApi = null;
      }

      if (currentApi === null || row.apiName !== currentApi.keyName) {
        currentApi = { keyName: row.apiName, permissions: [] };
        result.apis.push(currentApi);
      }

      const permission: RolePermission = { action: row.action, contentId: row.contentId, contentType: row.contentType };
      currentApi.permissions.push(permission);
    });

    if (result === null) {
      const church: Church = await this.repositories.church.loadById(churchId);
      result = { church: { id: church.id, subDomain: church.subDomain, name: church.name }, person: {}, apis: [] };
    }

    await this.appendPersonInfo(result, au, churchId);
    return result;
  }
}
