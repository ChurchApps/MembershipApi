import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { Group } from "../models";
import { Permissions } from "../helpers/Permissions";
import { ArrayHelper, SlugHelper } from "@churchapps/apihelper";

@controller("/groups")
export class GroupController extends MembershipBaseController {
  @httpGet("/search")
  public async search(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const campusId = req.query.campusId.toString();
      const serviceId = req.query.serviceId.toString();
      const serviceTimeId = req.query.serviceTimeId.toString();
      return this.repositories.group.convertAllToModel(
        au.churchId,
        await this.repositories.group.search(au.churchId, campusId, serviceId, serviceTimeId)
      );
    });
  }

  @httpGet("/my")
  public async getMy(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return this.repositories.group.convertAllToModel(
        au.churchId,
        await this.repositories.group.loadForPerson(au.personId)
      );
    });
  }

  @httpGet("/:id")
  public async get(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return this.repositories.group.convertToModel(au.churchId, await this.repositories.group.load(au.churchId, id));
    });
  }

  @httpGet("/public/:churchId/slug/:slug")
  public async getPublicSlug(
    @requestParam("churchId") churchId: string,
    @requestParam("slug") slug: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      return this.repositories.group.convertToModel(
        churchId,
        await this.repositories.group.loadPublicSlug(churchId, slug)
      );
    });
  }

  @httpGet("/public/:churchId/label")
  public async getPublicLabel(
    @requestParam("churchId") churchId: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      const label = req.query.label.toString();
      return this.repositories.group.convertAllToModel(
        churchId,
        await this.repositories.group.publicLabel(churchId, label)
      );
    });
  }

  @httpGet("/public/:churchId/:id")
  public async getPublic(
    @requestParam("churchId") churchId: string,
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      return this.repositories.group.convertToModel(churchId, await this.repositories.group.load(churchId, id));
    });
  }

  @httpGet("/tag/:tag")
  public async getByTag(
    @requestParam("tag") tag: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return this.repositories.group.convertAllToModel(
        au.churchId,
        await this.repositories.group.loadByTag(au.churchId, tag)
      );
    });
  }

  @httpGet("/public/:churchId/tag/:tag")
  public async getPublicByTag(
    @requestParam("churchId") churchId: string,
    @requestParam("tag") tag: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      return this.repositories.group.convertAllToModel(
        churchId,
        await this.repositories.group.loadByTag(churchId, tag)
      );
    });
  }

  @httpGet("/")
  public async getAll(
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return this.repositories.group.convertAllToModel(au.churchId, await this.repositories.group.loadAll(au.churchId));
    });
  }

  @httpPost("/")
  public async save(
    req: express.Request<{}, {}, Group[]>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.groups.edit)) return this.json({}, 401);
      else {
        const promises: Promise<Group>[] = [];
        req.body.forEach((group) => {
          group.churchId = au.churchId;
          if (!group.slug) group.slug = SlugHelper.slugifyString(group.name);
          promises.push(this.repositories.group.save(group));
        });
        const result = await Promise.all(promises);
        return this.repositories.group.convertAllToModel(au.churchId, result);
      }
    });
  }

  @httpDelete("/:id")
  public async delete(
    @requestParam("id") id: string,
    req: express.Request<{}, {}, null>,
    res: express.Response
  ): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.groups.edit)) return this.json({}, 401);
      else {
        const group: Group = await this.repositories.group.load(au.churchId, id);
        if (group.tags.indexOf("ministry") > -1) {
          const AllTeams = await this.repositories.group.loadByTag(au.churchId, "team");
          const ministryTeams = ArrayHelper.getAll(AllTeams, "categoryName", id);
          const ids = ArrayHelper.getIds(ministryTeams, "id");
          await this.repositories.group.delete(au.churchId, id);
          await this.repositories.group.deleteByIds(au.churchId, ids);
          return this.json({});
        } else {
          await this.repositories.group.delete(au.churchId, id);
          return this.json({});
        }
      }
    });
  }
}
