import { QueryPersonsArgs, ReqContext, SortDirection } from '../types'

export default {
  Query: {
    persons: async (root: any, args: QueryPersonsArgs, ctx: ReqContext): Promise<any[]> => {
      const { from = 0, size = 12, sort = SortDirection.Desc } = args

      return []
    },
  },
  Mutation: {
    test: () => true
  }
}
