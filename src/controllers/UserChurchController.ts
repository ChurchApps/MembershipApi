import { controller, httpGet, httpPatch, httpPost, requestParam } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { UserChurch } from "../models";
import jwt from "jsonwebtoken";
import { Environment } from "../helpers";


@controller("/userchurch")
export class UserChurchController extends MembershipBaseController {

  @httpPost("/claim")
  public async claim(req: express.Request<{}, {}, { encodedPerson: string }, null>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async ({ id, churchId }) => {
      const decoded: any = jwt.verify(req.body.encodedPerson, Environment.jwtSecret);
      const userChurch: UserChurch = {
        userId: id,
        churchId,
        personId: decoded.id
      }

      const existing = await this.repositories.userChurch.loadByUserId(id, churchId);
      if (!existing) {
        const result = await this.repositories.userChurch.save(userChurch);
        return this.repositories.userChurch.convertToModel(result);
      } else {
        if (existing.personId !== decoded.id) {
          existing.personId = decoded.id;
          await this.repositories.userChurch.save(existing);
        }
        return existing;
      }
    })
  }

  @httpPatch("/:userId")
  public async update(@requestParam("userId") userId: string, req: express.Request, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async () => {
      const { churchId, appName } = req.body;
      await this.repositories.accessLog.create({ appName: appName || "", churchId, userId });
      const existing = await this.repositories.userChurch.loadByUserId(userId, churchId);
      if (!existing) {
        return this.json({ message: 'No church found for user' }, 400);
      } else {
        const updatedUserChrurch: UserChurch = {
          id: existing?.id,
          userId,
          personId: existing.personId,
          churchId,
          lastAccessed: new Date()
        }
        await this.repositories.userChurch.save(updatedUserChrurch);
      }
      return existing;
    })
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, UserChurch, { userId: string }>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const userId = req.query.userId || au.id;
      const record = await this.repositories.userChurch.loadByUserId(userId, au.churchId);
      let result: any = {}
      if (record) {
        if (record.userId !== userId) return this.json({ message: 'User already has a linked person record' }, 400);
      } else {
        const userChurch: UserChurch = {
          userId,
          churchId: au.churchId,
          personId: req.body.personId
        }
        const data = await this.repositories.userChurch.save(userChurch);
        result = this.repositories.userChurch.convertToModel(data)
      }
      return result;
    })
  }

  @httpGet("/userid/:userId")
  public async getByUserId(@requestParam("userId") userId: string, req: express.Request, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async ({ churchId }) => {
      const record = await this.repositories.userChurch.loadByUserId(userId, churchId);
      return this.repositories.userChurch.convertToModel(record);
    })
  }

}