import { DB } from "@churchapps/apihelper";
import { OAuthToken } from "../models";
import { UniqueIdHelper, DateHelper } from "../helpers";

export class OAuthTokenRepository {
  public save(token: OAuthToken) {
    return token.id ? this.update(token) : this.create(token);
  }

  private async create(token: OAuthToken) {
    token.id = UniqueIdHelper.shortId();
    const expiresAt = DateHelper.toMysqlDate(token.expiresAt);
    const sql = "INSERT INTO oAuthTokens (id, accessToken, refreshToken, clientId, userChurchId, scopes, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW());";
    const params = [token.id, token.accessToken, token.refreshToken, token.clientId, token.userChurchId, token.scopes, expiresAt];
    await DB.query(sql, params);
    return token;
  }

  private async update(token: OAuthToken) {
    const expiresAt = DateHelper.toMysqlDate(token.expiresAt);
    const sql = "UPDATE oAuthTokens SET accessToken=?, refreshToken=?, clientId=?, userChurchId=?, scopes=?, expiresAt=? WHERE id=?;";
    const params = [token.accessToken, token.refreshToken, token.clientId, token.userChurchId, token.scopes, expiresAt, token.id];
    await DB.query(sql, params);
    return token;
  }

  public load(id: string): Promise<OAuthToken> {
    return DB.queryOne("SELECT * FROM oAuthTokens WHERE id=?", [id]);
  }

  public loadByAccessToken(accessToken: string): Promise<OAuthToken> {
    return DB.queryOne("SELECT * FROM oAuthTokens WHERE accessToken=?", [accessToken]);
  }

  public loadByRefreshToken(refreshToken: string): Promise<OAuthToken> {
    return DB.queryOne("SELECT * FROM oAuthTokens WHERE refreshToken=?", [refreshToken]);
  }

  public loadByClientAndUser(clientId: string, userChurchId: string): Promise<OAuthToken> {
    return DB.queryOne("SELECT * FROM oAuthTokens WHERE clientId=? AND userChurchId=?", [clientId, userChurchId]);
  }

  public delete(id: string) {
    return DB.query("DELETE FROM oAuthTokens WHERE id=?", [id]);
  }

  public deleteByAccessToken(accessToken: string) {
    return DB.query("DELETE FROM oAuthTokens WHERE accessToken=?", [accessToken]);
  }

  public deleteByRefreshToken(refreshToken: string) {
    return DB.query("DELETE FROM oAuthTokens WHERE refreshToken=?", [refreshToken]);
  }

  public deleteExpired() {
    return DB.query("DELETE FROM oAuthTokens WHERE expiresAt < NOW()", []);
  }
}