import { controller, httpDelete, httpGet, httpPatch, httpPost, requestParam } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { UserChurch } from "../models";

@controller("/userchurch")
export class UserChurchController extends MembershipBaseController {
  @httpPatch("/:userId")
  public async update(
    @requestParam("userId") userId: string,
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async () => {
      const { churchId, appName } = req.body;
      await this.repositories.accessLog.create({ appName: appName || "", churchId, userId });
      const existing = await this.repositories.userChurch.loadByUserId(userId, churchId);
      if (!existing) {
        return this.json({ message: "No church found for user" }, 400);
      } else {
        const existingUserChurch = existing as UserChurch;
        const updatedUserChrurch: UserChurch = {
          id: existingUserChurch?.id,
          userId,
          personId: existingUserChurch.personId,
          churchId,
          lastAccessed: new Date()
        };
        await this.repositories.userChurch.save(updatedUserChrurch);
      }
      return existing;
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, UserChurch, { userId: string }>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const userId = req.query.userId || au.id;
      const record = await this.repositories.userChurch.loadByUserId(userId, au.churchId);
      let result: any = {};
      if (record) {
        const userChurchRecord = record as UserChurch;
        if (userChurchRecord.userId !== userId)
          return this.json({ message: "User already has a linked person record" }, 400);
      } else {
        const userChurch: UserChurch = {
          userId,
          churchId: au.churchId,
          personId: req.body.personId
        };
        const data = await this.repositories.userChurch.save(userChurch);
        result = this.repositories.userChurch.convertToModel(data);
      }
      return result;
    });
  }

  @httpGet("/userid/:userId")
  public async getByUserId(
    @requestParam("userId") userId: string,
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async ({ churchId }) => {
      const record = await this.repositories.userChurch.loadByUserId(userId, churchId);
      return this.repositories.userChurch.convertToModel(record);
    });
  }

  @httpDelete("/record/:userId/:churchId/:personId")
  public async deleteRecord(
    @requestParam("userId") userId: string,
    @requestParam("churchId") churchId: string,
    @requestParam("personId") personId: string,
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      await this.repositories.userChurch.deleteRecord(userId, churchId, personId);
      return this.json({});
    });
  }
}
