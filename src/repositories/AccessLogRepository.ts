import { DB } from "@churchapps/apihelper";
import { AccessLog } from "../models";
import { UniqueIdHelper } from "../helpers";

export class AccessLogRepository {
  public async create(log: AccessLog) {
    log.id = UniqueIdHelper.shortId();
    const sql = "INSERT INTO accessLogs (id, userId, churchId, appName, loginTime) VALUES (?, ?, ?, ?, ?);";
    const params = [log.id, log.userId, log.churchId, log.appName, new Date()];
    await DB.query(sql, params);
    return log;
  }
}
