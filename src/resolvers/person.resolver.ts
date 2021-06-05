import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryPeopleArgs, QueryPersonArgs, ReqContext, SortDirection, Person, PersonsResult, Group, HouseHold } from '../types'
import { initPagination } from '../helpers'

export default {
  Query: {
    person: async (root: unknown, args: QueryPersonArgs, ctx: ReqContext): Promise<Person | null> => {
      const { id } = args.where
      if (!id) {
        throw new UserInputError('user_id is required')
      }
      const person = await prisma.people.findFirst({ where: {
        id
      }})
      return person
    },
    people: async (root: any, args: QueryPeopleArgs, ctx: ReqContext): Promise<Person[] | null> => {
      const { from, size } = initPagination(args.pagination)
      let people = await prisma.people.findMany({
        skip: from,
        take: size,
        where: {
          ...args.where,
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
    },
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
  }
}
