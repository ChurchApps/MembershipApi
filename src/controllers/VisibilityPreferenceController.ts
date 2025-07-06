import { controller, httpGet, httpPost, interfaces } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { VisibilityPreference } from "../models";

@controller("/visibilityPreferences")
export class VisibilityPreferenceController extends MembershipBaseController {
  @httpPost("/")
  public async save(req: express.Request<{}, {}, VisibilityPreference[]>, res: express.Response): Promise<any> {
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

  @httpGet("/my")
  public async loadMy(req: express.Request<{}, {}, []>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const result = await this.repositories.visibilityPreference.loadForPerson(au.churchId, au.personId);
      const preferences = result as VisibilityPreference[];
      return preferences?.length > 0 ? preferences[0] : [];
    });
  }
}
