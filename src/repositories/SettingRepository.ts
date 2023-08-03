import { injectable } from "inversify"
import { DB } from "../apiBase/db";
import { Setting } from "../models";
import { UniqueIdHelper } from "../apiBase/helpers";

@injectable()
export class SettingRepository {

    public save(setting: Setting) {
        return setting.id ? this.update(setting) : this.create(setting);
    }

    private async create(setting: Setting) {
        setting.id = UniqueIdHelper.shortId();
        const sql = "INSERT INTO settings (id, churchId, keyName, value, public) VALUES (?, ?, ?, ?, ?)";
        const params = [setting.id, setting.churchId, setting.keyName, setting.value, setting.public];
        await DB.query(sql, params);
        return setting;
    }

    private async update(setting: Setting) {
        const sql = "UPDATE settings SET churchId=?, keyName=?, value=?, public=? WHERE id=? AND churchId=?";
        const params = [setting.churchId, setting.keyName, setting.value, setting.public, setting.id, setting.churchId];
        await DB.query(sql, params);
        return setting;
    }

    public loadAll(churchId: string) {
        return DB.query("SELECT * FROM settings WHERE churchId=?;", [churchId]);
    }

    public loadPublicSettings(churchId: string) {
        return DB.query("SELECT * FROM settings WHERE churchId=? AND public=?", [churchId, 1])
    }

    public loadMulipleChurches(keyNames: string[], churchIds: string[]) {
        return DB.query("SELECT * FROM settings WHERE keyName in (?) AND churchId IN (?) AND public=1", [keyNames, churchIds])
    }

    public convertToModel(churchId: string, data: any) {
        const result: Setting = {
            id: data.id,
            keyName: data.keyName,
            value: data.value,
            public: data.public
        };
        return result;
    }

    public convertAllToModel(churchId: string, data: any[]) {
        const result: Setting[] = [];
        data.forEach(d => result.push(this.convertToModel(churchId, d)));
        return result;
    }
}