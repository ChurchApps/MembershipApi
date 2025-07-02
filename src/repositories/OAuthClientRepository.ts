import { DB } from "@churchapps/apihelper";
import { OAuthClient } from "../models";
import { UniqueIdHelper } from "../helpers";

export class OAuthClientRepository {
  public save(client: OAuthClient) {
    return client.id ? this.update(client) : this.create(client);
  }

  private async create(client: OAuthClient) {
    client.id = UniqueIdHelper.shortId();
    const sql =
      "INSERT INTO oAuthClients (id, name, clientId, clientSecret, redirectUris, scopes, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW());";
    const params = [client.id, client.name, client.clientId, client.clientSecret, client.redirectUris, client.scopes];
    await DB.query(sql, params);
    return client;
  }

  private async update(client: OAuthClient) {
    const sql = "UPDATE oAuthClients SET name=?, clientId=?, clientSecret=?, redirectUris=?, scopes=? WHERE id=?;";
    const params = [client.name, client.clientId, client.clientSecret, client.redirectUris, client.scopes, client.id];
    await DB.query(sql, params);
    return client;
  }

  public load(id: string): Promise<OAuthClient> {
    return DB.queryOne("SELECT * FROM oAuthClients WHERE id=?", [id]);
  }

  public loadByClientId(clientId: string): Promise<OAuthClient> {
    return DB.queryOne("SELECT * FROM oAuthClients WHERE clientId=?", [clientId]);
  }

  public loadByClientIdAndSecret(clientId: string, clientSecret: string): Promise<OAuthClient> {
    return DB.queryOne("SELECT * FROM oAuthClients WHERE clientId=? AND clientSecret=?", [clientId, clientSecret]);
  }

  public delete(id: string) {
    return DB.query("DELETE FROM oAuthClients WHERE id=?", [id]);
  }

  public async loadAll() {
    return DB.query("SELECT * FROM oAuthClients ORDER BY name", []);
  }
}
