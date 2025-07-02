import { controller, httpPost } from "inversify-express-utils";
import express from "express";
import { ClientError } from "../models";
import { MembershipBaseController } from "./MembershipBaseController";

@controller("/clientErrors")
export class ClientErrorController extends MembershipBaseController {
  @httpPost("/")
  public async save(req: express.Request<{}, {}, ClientError[]>, res: express.Response): Promise<any> {
    const promises: Promise<ClientError>[] = [];
    req.body.forEach((person) => {
      promises.push(this.repositories.clientError.save(person));
    });
    const result = await Promise.all(promises);
    return result;
  }
}
