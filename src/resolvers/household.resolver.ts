import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryHouseholdArgs, QueryHouseholdsArgs, ReqContext, HouseHold, Person } from '../types'
import { initPagination } from '../helpers'

export default {
  Query: {
    household: async (root: unknown, args: QueryHouseholdArgs, ctx: ReqContext): Promise<HouseHold | null> => {
      const household = await prisma.households.findFirst({
        where: {
          id: args.where.id,
        },
        include: {
          people: true,
        },
      })
      return {
        ...household,
        person: household.people
      }
    },
    households: async (root: any, args: QueryHouseholdsArgs, ctx: ReqContext): Promise<HouseHold[] | null> => {
      const { from, size } = initPagination(args.pagination)
      const households = await prisma.households.findMany({
        skip: from,
        take: size,
        include: {
          people: true
        },
      })
      return households.map(h => ({
        ...h,
        person: h.people
      }))
    },
  },
  HouseHold: {
    person: async (root: HouseHold, args: null, ctx: ReqContext): Promise<Person | null> => {
      if (!root.person) {
        // this is dataloader approach
        // https://www.npmjs.com/package/dataloader
        return ctx.peopleFromHouseHoldLoader.load(root.id)
        // return prisma.people.findFirst({
        //   where: {
        //     householdId: root.id
        //   }
        // })
      }

      return root.person
    }
  }
}
