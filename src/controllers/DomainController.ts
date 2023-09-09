import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController"
import { Domain } from "../models"
import { Permissions } from '../helpers/Permissions'
import { CaddyHelper, Environment } from "../helpers";

@controller("/domains")
export class DomainController extends MembershipBaseController {

  @httpGet("/test")
  public async test(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      console.log("made it")
      const jsonData = await CaddyHelper.generateJsonData();
      // await CaddyHelper.updateCaddy();
      console.log("JSON", jsonData)
      return jsonData;
    });
  }

  @httpGet("/test2")
  public async test2(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      const adminUrl = "https://" + Environment.caddyHost + ":" + Environment.caddyPort + "/load";
      return { adminUrl }
    });
  }

  @httpGet("/:id")
  public async get(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.domain.load(au.churchId, id);
    });
  }

  @httpGet("/lookup/:domainName")
  public async getByName(@requestParam("domainName") domainName: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.domain.loadByName(domainName);
    });
  }

  @httpGet("/public/lookup/:domainName")
  public async getPublicByName(@requestParam("domainName") domainName: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      return await this.repositories.domain.loadByName(domainName);
    })
  }


  @httpGet("/")
  public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.domain.loadAll(au.churchId);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Domain[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.settings.edit)) return this.json({}, 401);
      else {
        const promises: Promise<Domain>[] = [];
        req.body.forEach(domain => { domain.churchId = au.churchId; promises.push(this.repositories.domain.save(domain)); });
        const result = await Promise.all(promises);
        await CaddyHelper.updateCaddy();
        return result;
      }
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.settings.edit)) return this.json({}, 401);
      else await this.repositories.domain.delete(au.churchId, id);
    });
  }

}
