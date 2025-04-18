import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { MembershipBaseController } from "./MembershipBaseController";
import { LoginUserChurch, OAuthClient, OAuthCode, OAuthToken } from "../models";
import { Permissions } from "../helpers/Permissions";
import { UniqueIdHelper } from "../helpers";
import { AuthenticatedUser } from "../auth";


@controller("/oauth")
export class OAuthController extends MembershipBaseController {

  @httpPost("/authorize")
  public async authorize(req: express.Request<{}, {}, { client_id: string, redirect_uri: string, response_type: string, scope: string, state?: string }>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const { client_id, redirect_uri, response_type, scope, state } = req.body;

      const client = await this.repositories.oAuthClient.loadByClientId(client_id);
      if (!client) return this.json({ error: "invalid_client" }, 400);
      if (!client.redirectUris?.includes(redirect_uri)) return this.json({ error: "invalid_redirect_uri" }, 400);
      if (response_type !== "code") return this.json({ error: "unsupported_response_type" }, 400);

      const userChurch = await this.repositories.userChurch.loadByUserId(au.id, au.churchId);

      // Create authorization code
      const authCode: OAuthCode = {
        userChurchId: userChurch.id,
        clientId: client.id,
        code: UniqueIdHelper.shortId(),
        redirectUri: redirect_uri,
        scopes: scope,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      };
      await this.repositories.oAuthCode.save(authCode);

      // Return authorization code
      return this.json({
        code: authCode.code,
        state: state || null
      });
    });
  }

  @httpPost("/token")
  public async token(req: express.Request<{}, {}, { grant_type: string, code?: string, refresh_token?: string, client_id: string, client_secret: string, redirect_uri?: string }>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapperAnon(req, res, async () => {
      const { grant_type, code, refresh_token, client_id, client_secret, redirect_uri } = req.body;

      const client = await this.repositories.oAuthClient.loadByClientIdAndSecret(client_id, client_secret);
      if (!client) return this.json({ error: "invalid_client" }, 400);

      if (grant_type === "authorization_code") {
        if (!code) return this.json({ error: "invalid_request" }, 400);
        const authCode = await this.repositories.oAuthCode.loadByCode(code);
        if (!authCode || authCode.clientId !== client.id) return this.json({ error: "invalid_grant" }, 400);
        if (redirect_uri && authCode.redirectUri !== redirect_uri) return this.json({ error: "invalid_grant" }, 400);

        if (authCode.expiresAt && authCode.expiresAt < new Date()) {
          await this.repositories.oAuthCode.delete(authCode.id);
          return this.json({ error: "invalid_grant" }, 400);
        }

        const userChurch = await this.repositories.userChurch.load(authCode.userChurchId);
        const user = await this.repositories.user.load(userChurch.userId);
        const church = await this.repositories.church.loadById(userChurch.churchId);
        const loginUserChurch: LoginUserChurch = { church: { id: church.id, name: church.churchName, subDomain: church.subDomain }, person: { id: userChurch.personId, membershipStatus: "Guest" }, apis: [] };

        // Create access token
        const token: OAuthToken = {
          clientId: client.id,
          userChurchId: authCode.userChurchId,
          accessToken: AuthenticatedUser.getChurchJwt(user, loginUserChurch),
          refreshToken: UniqueIdHelper.shortId(),
          scopes: authCode.scopes,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 12) // 12 hours
        };
        await this.repositories.oAuthToken.save(token);

        // Delete used authorization code
        await this.repositories.oAuthCode.delete(authCode.id);

        return this.json({
          access_token: token.accessToken,
          token_type: "Bearer",
          expires_in: 3600 * 12,
          refresh_token: token.refreshToken,
          scope: token.scopes
        });
      } else if (grant_type === "refresh_token") {
        if (!refresh_token) return this.json({ error: "invalid_request" }, 400);
        const oldToken = await this.repositories.oAuthToken.loadByRefreshToken(refresh_token);
        if (!oldToken || oldToken.clientId !== client.id) return this.json({ error: "invalid_grant" }, 400);

        // Create new access token
        const token: OAuthToken = {
          clientId: client.id,
          userChurchId: oldToken.userChurchId,
          accessToken: UniqueIdHelper.shortId(),
          refreshToken: UniqueIdHelper.shortId(),
          scopes: oldToken.scopes,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 12) // 12 hours
        };
        await this.repositories.oAuthToken.save(token);

        // Delete old token
        await this.repositories.oAuthToken.delete(oldToken.id);

        return this.json({
          access_token: token.accessToken,
          token_type: "Bearer",
          expires_in: 3600 * 12,
          refresh_token: token.refreshToken,
          scope: token.scopes
        });
      } else return this.json({ error: "unsupported_grant_type" }, 400);

    });
  }

  @httpGet("/clients")
  public async getClients(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.server.admin)) return this.json({}, 401);
      return await this.repositories.oAuthClient.loadAll();
    });
  }

  @httpGet("/clients/clientId/:clientId")
  public async getClientByClientId(@requestParam("clientId") clientId: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      const result = await this.repositories.oAuthClient.loadByClientId(clientId);;
      result.clientSecret = null;
      return result;
    });
  }

  @httpGet("/clients/:id")
  public async getClient(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.server.admin)) return this.json({}, 401);
      return await this.repositories.oAuthClient.load(id);
    });
  }

  @httpPost("/clients")
  public async saveClient(req: express.Request<{}, {}, OAuthClient>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.server.admin)) return this.json({}, 401);
      return await this.repositories.oAuthClient.save(req.body);
    });
  }

  @httpDelete("/clients/:id")
  public async deleteClient(@requestParam("id") id: string, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess(Permissions.server.admin)) return this.json({}, 401);
      await this.repositories.oAuthClient.delete(id);
      return this.json({}, 200);
    });
  }

}