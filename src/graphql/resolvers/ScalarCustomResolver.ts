import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const resolverMap = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    parseValue(value: any) { return new Date(value) },
    serialize(value: any) { return new Date(value) },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT || ast.kind === Kind.STRING) return new Date(ast.value);
      return null;
    },
  }),
}

export default resolverMap
