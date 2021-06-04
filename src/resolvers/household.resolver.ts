import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryHouseholdArgs, QueryHouseholdsArgs, ReqContext, HouseHold, Person } from '../types'
import { initPagination } from '../helpers'

export default {
  Query: {
    household: async (root: unknown, args: QueryHouseholdArgs, ctx: ReqContext): Promise<HouseHold | null> => {
      return prisma.households.findFirst({
        where: {
          id: args.where.id,
        },
        include: {
          people: true,
        },
      })
    },
    households: async (root: any, args: QueryHouseholdsArgs, ctx: ReqContext): Promise<HouseHold[] | null> => {
      const { from, size } = initPagination(args.pagination)

      return prisma.households.findMany({
        skip: from,
        take: size,
        include: {
          people: true
        },
      })
    },
  },
  HouseHold: {
    person: async (root: HouseHold, args: null, ctx: ReqContext): Promise<Person | null> => {
      // TODO: add data-loader here
      if (!root.person) {
        return prisma.people.findFirst({
          where: {
            householdId: root.id
          }
        })
      }

      return root.person
    }
  }
}
