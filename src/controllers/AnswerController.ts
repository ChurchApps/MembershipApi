import { controller, httpGet } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { Permissions } from "../helpers";

@controller("/answers")
export class AnswerController extends MembershipBaseController {
  @httpGet("/")
  public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<unknown> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.forms.admin) || !au.checkAccess(Permissions.forms.edit))
        return this.json({}, 401);
      else {
        let data = null;
        if (req.query.formSubmissionId !== undefined)
          data = this.repositories.answer.loadForFormSubmission(au.churchId, req.query.formSubmissionId.toString());
        else data = await this.repositories.answer.loadAll(au.churchId);
        return this.repositories.answer.convertAllToModel(au.churchId, data);
      }
    });
  }
}
