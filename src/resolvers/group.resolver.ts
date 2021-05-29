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
    groups: async (root: any, args: QueryGroupsArgs, ctx: ReqContext): Promise<GroupsResult> => {
      const { from, size } = initPagination(args.pagination)
      const [ groups, total ] = await Promise.all([
        prisma.groups.findMany({ skip: from, take: size }),
        prisma.groups.count()
      ])

      return {
        edges: groups,
        total
      }
    },
  },
}
