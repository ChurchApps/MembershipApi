import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryPeopleArgs, QueryPersonArgs, ReqContext, SortDirection, Person, PersonsResult } from '../types'
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
      const people =  await prisma.people.findMany({ skip: from, take: size, where: {
        ...args.where,
      }})

      return people
    },
  },
  Mutation: {
    test: () => true
  }
}
