import { Api } from "../Api";
import { Church } from "../Church";

export class LoginUserChurch {
  public personId?: string;

  public church?: Church;
  public apis?: Api[];
  public jwt?: string;
  public groupIds?: string[];
}