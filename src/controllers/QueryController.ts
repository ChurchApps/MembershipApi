import { controller, httpPost } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { OpenAiHelper } from "../helpers/OpenAiHelper";
import { ArrayHelper, Permissions, PersonHelper } from "../helpers";

@controller("/query")
export class QueryController extends MembershipBaseController {

  @httpPost("/members")
  public async queryMembers(req: express.Request<{}, {}, any>, res: express.Response): Promise<any> {
    return this.actionWrapper(req, res, async (au) => {
      const { text, subDomain, siteUrl } = req.body;

      if (text && text !== "") {
        OpenAiHelper.initialize();
        //Proccess the natural language query
        const apiRequestPrompt = await OpenAiHelper.buildPrompt(text);
        const aiResponse = await OpenAiHelper.getCompletion(apiRequestPrompt, subDomain, siteUrl);
        if (aiResponse && aiResponse.length > 0) {
          let peopleData: any[] = (await this.repositories.person.loadAll(au.churchId)) as any[];
          aiResponse.forEach((resp: { field: string; value: string; operator: string }) => {
            switch (resp.field) {
              case "age":
                peopleData.forEach((p) => {
                  p.age = PersonHelper.getAge(p.birthDate);
                });
                peopleData = ArrayHelper.getAllOperator(peopleData, "age", resp.value, resp.operator, "number");
                break;
              case "yearsMarried":
                peopleData.forEach((p) => {
                  p.yearsMarried = PersonHelper.getAge(p.anniversaryDate);
                });
                peopleData = ArrayHelper.getAllOperator(
                  peopleData,
                  "yearsMarried",
                  resp.value,
                  resp.operator,
                  "number"
                );
                break;
              case "birthMonth":
                peopleData.forEach((p) => {
                  p.birthMonth = PersonHelper.getBirthMonth(p.birthDate);
                });
                peopleData = ArrayHelper.getAllOperator(peopleData, "birthMonth", resp.value, resp.operator, "number");
                break;
              case "anniversaryMonth":
                peopleData.forEach((p) => {
                  p.anniversaryMonth = PersonHelper.getBirthMonth(p.anniversaryMonth);
                });
                peopleData = ArrayHelper.getAllOperator(
                  peopleData,
                  "anniversaryMonth",
                  resp.value,
                  resp.operator,
                  "number"
                );
                break;
              // case "phone"
              default:
                peopleData = ArrayHelper.getAllOperator(peopleData, resp.field, resp.value, resp.operator);
                break;
            }
          });
          const result = this.repositories.person.convertAllToModel(
            au.churchId,
            peopleData,
            au.checkAccess(Permissions.people.edit)
          );
          return result;
        }
      }
    });
  }
}
