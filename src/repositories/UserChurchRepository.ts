import { DB } from '@churchapps/apihelper';
import { UserChurch } from '../models';
import { UniqueIdHelper, DateHelper } from '../helpers';

export class UserChurchRepository {

    public save(userChurch: UserChurch) {
        return userChurch.id ? this.update(userChurch) : this.create(userChurch);
    }

    private async create(userChurch: UserChurch) {
        userChurch.id = UniqueIdHelper.shortId();
        const { id, userId, churchId, personId } = userChurch;
        const sql = `INSERT INTO userChurches (id, userId, churchId, personId, lastAccessed) values (?, ?, ?, ?, NOW())`;
        const params = [id, userId, churchId, personId];
        await DB.query(sql, params);
        return userChurch;
    }

    private async update(userChurch: UserChurch) {
        const { id, userId, churchId, personId, lastAccessed } = userChurch;
        const sql = "UPDATE userChurches SET userId=?, churchId=?, personId=?, lastAccessed=? WHERE id=?;";
        const params = [userId, churchId, personId, DateHelper.toMysqlDate(lastAccessed), id];
        await DB.query(sql, params);
        return userChurch;
    }

    public delete(userId: string) {
      const query = "DELETE FROM userChurches WHERE userId=?"
      return DB.query(query, [userId])
    }

    public loadByUserId(userId: string, churchId: string) {
        const sql = "SELECT * FROM userChurches WHERE userId=? AND churchId=?";
        const params = [userId, churchId];
        return DB.queryOne(sql, params);
    }

    public convertToModel({ id, userId, churchId, personId, lastAccessed }: any) {
        const result: UserChurch = { id, userId, churchId, personId, lastAccessed };
        return result;
    }

    public convertAllToModel(data: any[]) {
        const result: UserChurch[] = [];
        data.forEach(d => result.push(this.convertToModel(d)));
        return result;
    }

}