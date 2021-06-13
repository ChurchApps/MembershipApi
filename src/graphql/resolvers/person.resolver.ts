import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryPeopleArgs, QueryPersonArgs, ReqContext, SortDirection, Person, PersonsResult, Group, HouseHold } from '../types'
import { initPagination, isAuthenticated } from '../../helpers'
import { combineResolvers } from 'graphql-resolvers'

export default {
  Query: {
    person: combineResolvers(
      isAuthenticated,
      async (root: unknown, args: QueryPersonArgs, ctx: ReqContext): Promise<Person | null> => {
        const { id } = args.where
        if (!id) {
          throw new UserInputError('user_id is required')
        }
        // adding churchId filter
        // TODO: in case admin want to see all people without churchId filter?
        const churchId = ctx.me?.churchId
        const person = await prisma.people.findFirst({ where: {
          id,
          churchId,
        }})
        return person
      }
    ),
    people: combineResolvers(
      isAuthenticated,
      async (root: any, args: QueryPeopleArgs, ctx: ReqContext): Promise<Person[] | null> => {
        const { from, size } = initPagination(args.pagination)
        // adding churchId filter
        const churchId = ctx.me?.churchId
        // TODO: in case admin want to see all people without churchId filter?
        let people = await prisma.people.findMany({
          skip: from,
          take: size,
          where: {
            ...args.where,
            churchId,
          },
          include: {
            groups: {
              include: {
                group: true
              }
            },
          },
        })
        people = people.map(person => {
          const groups: any[] = []
          person.groups.forEach(g => {
            if (g.group) {
              groups.push(g.group)
            }
          })
          person.groups = groups
          return person
        })

        return people
      }
    ),
  },
  Person: {
    household: async (root: Person, args: null, ctx: ReqContext): Promise<HouseHold | null> => {
      if (!root.household) {
        return ctx.householdLoader.load(root.householdId)
        // return prisma.households.findFirst({
        //   where: {
        //     id: root.householdId
        //   }
        // })
      }

      return root.household
    }
    // TODO: groups should be resolved here rather than in SQL
  }
}
