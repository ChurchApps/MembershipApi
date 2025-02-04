import { controller, httpGet, httpPost, interfaces } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { VisibilityPreference } from "../models";

@controller("/visibilityPreferences")
export class VisibilityPreferenceController extends MembershipBaseController {

  @httpPost("/")
  public async save(req: express.Request<{}, {}, VisibilityPreference[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const promises: Promise<VisibilityPreference>[] = [];
      req.body.forEach((v) => {
        v.churchId = au.churchId;
        v.personId = au.personId;
        promises.push(this.repositories.visibilityPreference.save(v));
      });
      const result = await Promise.all(promises);
      return result;
    });
  }

  @httpGet("/")
  public async loadAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.visibilityPreference.loadAll(au.churchId);
    })
  }

  @httpGet("/my")
  public async loadMy(req: express.Request<{}, {}, []>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const result = await this.repositories.visibilityPreference.loadForPerson(au.churchId, au.personId);
      return result?.length > 0 ? result[0] : [];
    });
  }
}
