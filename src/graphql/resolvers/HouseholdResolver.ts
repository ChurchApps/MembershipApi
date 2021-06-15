import _ from 'lodash'
import { QueryHouseholdArgs, QueryHouseholdsArgs, ReqContext, HouseHold, Person } from '../types'
import { initPagination, PrismaHelper } from '../helpers'
import { combineResolvers } from 'graphql-resolvers'

export class HouseholdResolver {

  private static householdQuery = async (root: unknown, args: QueryHouseholdArgs, ctx: ReqContext): Promise<HouseHold | null> => {
    const household = await PrismaHelper.getClient().households.findFirst({
      where: { id: args.where.id, },
    });
    return household;
  }

  private static householdsQuery = async (root: any, args: QueryHouseholdsArgs, ctx: ReqContext): Promise<HouseHold[] | null> => {
    const { from, size } = initPagination(args.pagination);
    const households = await PrismaHelper.getClient().households.findMany({
      skip: from,
      take: size,
    });
    return households;
  }

  private static householdPeopleQuery = async (root: HouseHold, args: null, ctx: ReqContext): Promise<Person[] | null> => {
    if (!root.people) {
      const householdPeople = await ctx.peopleFromHouseHoldLoader.load(root.id);
      return householdPeople.people;
    }
    return root.people;
  }

  public static getResolver = () => {
    return {
      Query: {
        household: combineResolvers(HouseholdResolver.householdQuery),
        households: HouseholdResolver.householdsQuery,
      },
      HouseHold: {
        people: HouseholdResolver.householdPeopleQuery
      }
    }
  }

}

