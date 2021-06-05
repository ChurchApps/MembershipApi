import DataLoader from 'dataloader'
import _ from 'lodash'
import { prisma } from '../prisma'
import { HouseHold } from '../types/schema.types'

const getHousehold = async (args: string[]) => {
  try {
    const ids = _.uniq(args)
    const households = await prisma.households.findMany({
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

export type HouseholdLoader = DataLoader<string, HouseHold | null>;

export const householdLoader = (): HouseholdLoader => new DataLoader<string, HouseHold | null>(getHousehold);
