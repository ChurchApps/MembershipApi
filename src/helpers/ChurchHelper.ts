import { ArrayHelper } from "../apiBase";
import { Repositories as BaseRepositories } from "../apiBase/repositories";
import { Church } from "../models";


export class ChurchHelper {

  static async appendLogos(churches: Church[]) {
    if (!churches || churches.length === 0) return;
    const ids = ArrayHelper.getIds(churches, "id");
    const settings = await BaseRepositories.getCurrent().setting.loadMulipleChurches(["logoLight", "logoDark"], ids);
    settings.forEach((s: any) => {
      const church = ArrayHelper.getOne(churches, "id", s.churchId);
      if (church.settings === undefined) church.settings = [];
      church.settings.push(s);
    });
  }

}

