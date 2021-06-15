import DataLoader from 'dataloader'
import _ from 'lodash'
import { prisma } from '../prisma'
import { Person } from '../types/schema.types'

interface IHouseholdPerson {
  householdId: string
  people: Person[]
}

export type PeopleFromHouseholdLoaderType = DataLoader<string, IHouseholdPerson | null>;

export class PeopleFromHouseholdLoader {
  private static getPeopleFromHousehold = async (args: string[]) => {
    try {
      const ids = _.uniq(args)
      const people = await prisma.people.findMany({
        where: {
          householdId: { in: ids }
        }
      })
      return args.map((id) => ({
        householdId: id,
        people: people.filter(r => r.householdId === id)
      }));
    } catch (error) {
      console.error(error);
      return args.map(() => null);
    }
  };

  public static getLoader = (): PeopleFromHouseholdLoaderType => new DataLoader<string, IHouseholdPerson | null>(PeopleFromHouseholdLoader.getPeopleFromHousehold);

}







