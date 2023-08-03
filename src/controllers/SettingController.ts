import { controller, httpPost, httpGet, interfaces, requestParam } from "inversify-express-utils"
import express from "express"
import { Setting } from "../models"
import { Permissions, FileHelper, Environment } from "../helpers"
import { MembershipBaseController } from "./MembershipBaseController"


@controller("/settings")
export class SettingController extends MembershipBaseController {

  @httpGet("/")
  public async get(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.settings.edit)) return this.json({}, 401);
      else {
        return this.repositories.setting.convertAllToModel(au.churchId, await this.repositories.setting.loadAll(au.churchId));
      }
    })
  }

  @httpPost("/")
  public async post(req: express.Request<{}, {}, Setting[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.settings.edit)) return this.json({}, 401);
      else {
        const promises: Promise<Setting>[] = []
        req.body.forEach(setting => {
          setting.churchId = au.churchId;
          promises.push(this.saveSetting(setting));
        })
        const result = await Promise.all(promises);
        return this.repositories.setting.convertAllToModel(au.churchId, result);
      }
    })
  }

  @httpGet("/public/:churchId")
  public async publicRoute(@requestParam("churchId") churchId: string, req: express.Request, res: express.Response): Promise<interfaces.IHttpActionResult> {
    try {
      const settings = this.repositories.setting.convertAllToModel(churchId, await this.repositories.setting.loadPublicSettings(churchId));
      const result: any = {};
      settings.forEach(s => {
        result[s.keyName] = s.value;
      })
      return this.json(result, 200);
    } catch (e) {
      this.logger.error(e);
      return this.internalServerError(e);
    }
  }

  private async saveSetting(setting: Setting) {
    if (setting.value.startsWith("data:image/")) setting = await this.saveImage(setting);
    setting = await this.repositories.setting.save(setting);
    return setting;
  }

  private async saveImage(setting: Setting) {
    const base64 = setting.value.split(',')[1];
    const key = "/" + setting.churchId + "/settings/" + setting.keyName + ".png";
    await FileHelper.store(key, "image/png", Buffer.from(base64, 'base64'));
    const photoUpdated = new Date();
    setting.value = Environment.contentRoot + key + "?dt=" + photoUpdated.getTime().toString();
    return setting;
  }

}