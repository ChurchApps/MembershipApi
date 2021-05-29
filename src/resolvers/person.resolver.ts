import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryPersonsArgs, QueryPersonArgs, ReqContext, SortDirection, Person, PersonsResult } from '../types'
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
    persons: async (root: any, args: QueryPersonsArgs, ctx: ReqContext): Promise<PersonsResult> => {
      const { from, size } = initPagination(args.pagination)
      const [ persons, total ] = await Promise.all([
        prisma.people.findMany({ skip: from, take: size }),
        prisma.people.count()
      ])

      return {
        edges: persons,
        total
      }
    },
  },
  Mutation: {
    test: () => true
  }
}
