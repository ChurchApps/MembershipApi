import { Api } from "../Api";
import { Church } from "../Church";
import { Person } from "../Person";

export class LoginUserChurch {
  public person: Person;
  public church: Church;
  public apis: Api[];
  public jwt?: string;
  public groups?: { id: string; tags: string; name: string; leader: boolean }[];
}
