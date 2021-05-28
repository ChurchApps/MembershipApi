import { QueryPersonsArgs, ReqContext, SortDirection, Person } from '../types'

export default {
  Query: {
    person: (): Promise<Person> => {
      return Promise.resolve({
        churchId: 'test',
        id: 'test-id'
      })
    },
    persons: async (root: any, args: QueryPersonsArgs, ctx: ReqContext): Promise<Person[]> => {
      const { from = 0, size = 12, sort = SortDirection.Desc } = args

      return []
    },
  },
  Mutation: {
    test: () => true
  }
}
