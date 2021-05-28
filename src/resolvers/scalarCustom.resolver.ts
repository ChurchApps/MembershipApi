import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value: any) {
      return new Date(value) // value from the client
    },
    serialize(value: any) {
      return new Date(value) // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null
    },
  }),
}

export default resolverMap
