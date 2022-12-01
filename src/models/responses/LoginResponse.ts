import { User } from "../";
import { LoginUserChurch } from "./LoginUserChurch";

export class LoginResponse {
  public user: User;
  public userChurches: LoginUserChurch[];
}
