import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryHouseholdArgs, QueryHouseholdsArgs, ReqContext, HouseHold, Person } from '../types'
import { initPagination, isAuthenticated } from '../helpers'
import { combineResolvers } from 'graphql-resolvers'

export default {
  Query: {
    household: combineResolvers(
      async (root: unknown, args: QueryHouseholdArgs, ctx: ReqContext): Promise<HouseHold | null> => {
        const household = await prisma.households.findFirst({
          where: {
            id: args.where.id,
          },
        })
        return household
      }
    ),
    households: async (root: any, args: QueryHouseholdsArgs, ctx: ReqContext): Promise<HouseHold[] | null> => {
      const { from, size } = initPagination(args.pagination)
      const households = await prisma.households.findMany({
        skip: from,
        take: size,
      })
      return households
    },
  },
  HouseHold: {
    people: async (root: HouseHold, args: null, ctx: ReqContext): Promise<Person[] | null> => {
      if (!root.people) {
        const householdPeople = await ctx.peopleFromHouseHoldLoader.load(root.id)
        return householdPeople.people
      }

      return root.people
    }
  }
}
