import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { prisma } from '../prisma'
import { QueryGroupsArgs, ReqContext, SortDirection, QueryGroupArgs, GroupsResult, Group } from '../types'
import { initPagination } from '../helpers'

export default {
  Query: {
    group: async (root: unknown, args: QueryGroupArgs, ctx: ReqContext): Promise<Group | null> => {
      const { id } = args.where
      if (!id) {
        throw new UserInputError('group_id is required')
      }
      const group = await prisma.groups.findFirst({ where: {
        id
      }})
      return group
    },
    groups: async (root: any, args: QueryGroupsArgs, ctx: ReqContext): Promise<Group[] | null> => {
      const { from, size } = initPagination(args.pagination)
      const groups  = await prisma.groups.findMany({ skip: from, take: size })


      return groups
    },
  },
}
