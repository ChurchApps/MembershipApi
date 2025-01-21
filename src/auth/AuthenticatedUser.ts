import { Principal, AuthenticatedUser as BaseAuthenticatedUser } from '@churchapps/apihelper'
import { Api, Church, LoginResponse, LoginUserChurch, User, UserChurch } from '../models'
import jwt from "jsonwebtoken";
import { Repositories } from '../repositories';
import { Environment } from '../helpers';

export class AuthenticatedUser extends BaseAuthenticatedUser {

  public static async login(allUserChurches: LoginUserChurch[], user: User) {
    const userChurches = [...allUserChurches];
    if (userChurches.length > 1 && userChurches[0].church.id === "") userChurches.splice(0, 1); // remove empty church with universal permissions if there are actual church records.

    // if (churches.length === 0) return null;
    // else {
    AuthenticatedUser.setJwt(userChurches, user);
    const result: LoginResponse = {
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName, id: user.id, jwt: AuthenticatedUser.getUserJwt(user) },
      userChurches
    }
    return result;
    // }
  }

  public static getApiJwt(api: Api, user: User, userChurch: LoginUserChurch) {
    const permList: string[] = [];
    api.permissions?.forEach(p => {
      let permString = p.contentType + "_" + String(p.contentId).replace('null', '') + "_" + p.action
      if (p.apiName) permString = p.apiName + "_" + p.contentType + "_" + String(p.contentId).replace('null', '') + "_" + p.action
      permList.push(permString);
    });

    const groupIds: string[] = [];
    userChurch.groups?.forEach(g => groupIds.push(g.id));
    const leaderGroupIds: string[] = [];
    userChurch.groups?.forEach(g => leaderGroupIds.push(g.id));
    return jwt.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, churchId: userChurch.church.id, personId: userChurch.person.id, apiName: api.keyName, permissions: permList, groupIds, leaderGroupIds, membershipStatus: userChurch.person?.membershipStatus }, Environment.jwtSecret, { expiresIn: Environment.jwtExpiration });
  }

  public static getChurchJwt(user: User, userChurch: LoginUserChurch) {
    const groupIds: string[] = [];
    userChurch.groups?.forEach(g => groupIds.push(g.id));
    const leaderGroupIds: string[] = [];
    userChurch.groups?.forEach(g => leaderGroupIds.push(g.id));
    return jwt.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, churchId: userChurch.church.id, personId: userChurch.person.id, groupIds, leaderGroupIds, membershipStatus: userChurch.person?.membershipStatus }, Environment.jwtSecret, { expiresIn: Environment.jwtExpiration });
  }

  public static getUserJwt(user: User) {
    return jwt.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }, Environment.jwtSecret, { expiresIn: "180 days" });
  }

  public static setJwt(allUserChurches: LoginUserChurch[], user: User) {
    allUserChurches.forEach(uc => {
      uc.apis?.forEach(api => {
        api.jwt = AuthenticatedUser.getApiJwt(api, user, uc);
        if (api.keyName === "ReportingApi") api.permissions = []; // We just need the jwt, not the list
      });
      uc.jwt = AuthenticatedUser.getChurchJwt(user, uc)
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
