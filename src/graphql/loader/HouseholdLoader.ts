import DataLoader from 'dataloader'
import _ from 'lodash'
import { PrismaHelper } from '../helpers'
import { HouseHold } from '../types/schema.types'

export type HouseholdLoaderType = DataLoader<string, HouseHold | null>;

export class HouseholdLoader {
  private static getHousehold = async (args: string[]) => {
    try {
      const ids = _.uniq(args)
      const households = await PrismaHelper.getClient().households.findMany({
        where: {
          id: {
            in: ids
          }
        }
      })

      return args.map((id) => households.find(r => r.id === id));
    } catch (error) {
      console.error(error);
      return args.map(() => null);
    }
  };

  static getLoader = (): HouseholdLoaderType => new DataLoader<string, HouseHold | null>(HouseholdLoader.getHousehold);

}






