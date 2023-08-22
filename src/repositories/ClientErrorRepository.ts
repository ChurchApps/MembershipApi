import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { ClientError } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class ClientErrorRepository {

    public save(clientError: ClientError) {
      return clientError.id ? this.update(clientError) : this.create(clientError);
    }

    private async create(clientError: ClientError) {
      clientError.id = UniqueIdHelper.shortId();
      const sql = "INSERT INTO clientErrors (id, application, errorTime, userId, churchId, originUrl, errorType, message, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
      const params = [clientError.id, clientError.application, clientError.errorTime, clientError.userId, clientError.churchId, clientError.originUrl, clientError.errorType, clientError.message, clientError.details];
      await DB.query(sql, params);
      return clientError;
    }

    private async update(clientError: ClientError) {
      const sql = "UPDATE clientErrors SET application=?, errorTime=?, userId=?, churchId=?, originUrl=?, errorType=?, message=?, details=? WHERE id=?";
      const params = [clientError.application, clientError.errorTime, clientError.userId, clientError.churchId, clientError.originUrl, clientError.errorType, clientError.message, clientError.details, clientError.id];
      await DB.query(sql, params);
      return clientError;
    }

    public deleteOld() {
      return DB.query("DELETE FROM clientErrors WHERE errorTime<date_add(NOW(), INTERVAL -7 DAY)", []);
    }

    public delete( id: string) {
      return DB.query("DELETE FROM clientErrors WHERE id=?;", [id]);
    }

    public load(id: string) {
      return DB.queryOne("SELECT * FROM clientErrors WHERE id=?;", [id]);
    }

    public loadAll() {
      return DB.query("SELECT * FROM clientErrors;", []);
    }


}
