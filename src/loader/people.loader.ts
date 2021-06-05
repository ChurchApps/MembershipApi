import DataLoader from 'dataloader'
import _ from 'lodash'
import { prisma } from '../prisma'
import { Person } from '../types/schema.types'

const getPeopleFromHousehold = async (args: string[]) => {
  try {
    const ids = _.uniq(args)
    const people = await prisma.people.findMany({
      where: {
        householdId: {
          in: ids
        }
      }
    })

    return args.map((id) => people.find(r => r.householdId === id));
  } catch (error) {
    console.error(error);
    return args.map(() => null);
  }
};

export type PeopleLoader = DataLoader<string, Person | null>;

export const peopleFromHouseholdLoader = (): PeopleLoader => new DataLoader<string, Person | null>(getPeopleFromHousehold);
