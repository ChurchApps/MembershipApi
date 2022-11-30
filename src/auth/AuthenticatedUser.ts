import { Principal, AuthenticatedUser as BaseAuthenticatedUser } from '../apiBase/auth'
import { Api, Church, LoginResponse, User } from '../models'
import jwt from "jsonwebtoken";
import { Repositories } from '../repositories';
import { Environment } from '../helpers';

export class AuthenticatedUser extends BaseAuthenticatedUser {

  public static async login(allChurches: Church[], user: User) {
    const churches = [...allChurches];
    if (churches.length > 1 && churches[0].id === "") churches.splice(0, 1); // remove empty church with universal permissions if there are actual church records.

    // if (churches.length === 0) return null;
    // else {
    AuthenticatedUser.setJwt(churches, user);
    const result: LoginResponse = {
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName, id: user.id, jwt: AuthenticatedUser.getUserJwt(user) },
      churches
    }
    return result;
    // }
  }

  public static getApiJwt(api: Api, user: User, church: Church) {
    const permList: string[] = [];
    api.permissions?.forEach(p => {
      let permString = p.contentType + "_" + String(p.contentId).replace('null', '') + "_" + p.action
      if (p.apiName) permString = p.apiName + "_" + p.contentType + "_" + String(p.contentId).replace('null', '') + "_" + p.action
      permList.push(permString);
    });
    return jwt.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, churchId: church.id, personId: church.personId, apiName: api.keyName, permissions: permList }, Environment.jwtSecret, { expiresIn: Environment.jwtExpiration });
  }

  public static getChurchJwt(user: User, church: Church) {
    return jwt.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, churchId: church.id, personId: church.personId }, Environment.jwtSecret, { expiresIn: Environment.jwtExpiration });
  }

  public static getUserJwt(user: User) {
    return jwt.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }, Environment.jwtSecret, { expiresIn: Environment.jwtExpiration });
  }

  public static setJwt(allChurches: Church[], user: User) {
    allChurches.forEach(c => {
      c.apis?.forEach(api => {
        api.jwt = AuthenticatedUser.getApiJwt(api, user, c);
        if (api.keyName === "ReportingApi") api.permissions = []; // We just need the jwt, not the list
      });
      c.jwt = AuthenticatedUser.getChurchJwt(user, c)
    });
  }

  public static async loadUserByJwt(token: string, repositories: Repositories) {
    let result: User = null;
    try {
      const decoded = new Principal(jwt.verify(token, Environment.jwtSecret));
      const userId: string = decoded.details.id;
      result = await repositories.user.load(userId);
    } catch { console.log('No match'); };
    return result;
  }

}
