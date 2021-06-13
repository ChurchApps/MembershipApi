import DataLoader from 'dataloader'
import _ from 'lodash'
import { prisma } from '../prisma'
import { Person } from '../types/schema.types'

interface IHouseholdPerson {
  householdId: string
  people: Person[]
}

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

    return args.map((id) => ({
      householdId: id,
      people: people.filter(r => r.householdId === id)
    }));
  } catch (error) {
    console.error(error);
    return args.map(() => null);
  }
};

export type PeopleFromHouseholdLoader = DataLoader<string, IHouseholdPerson | null>;

export const peopleFromHouseholdLoader = (): PeopleFromHouseholdLoader => new DataLoader<string, IHouseholdPerson | null>(getPeopleFromHousehold);
