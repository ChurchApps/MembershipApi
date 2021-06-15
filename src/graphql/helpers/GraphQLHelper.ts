import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { importSchema } from 'graphql-import';
import resolvers from '../resolvers'
import { ReqContext } from '../types/server.types';
import { HouseholdLoader, PeopleFromHouseholdLoader } from '../loader'
import { validateToken } from '../helpers/account';

export class GraphQLHelper {
    static getServer = () => {
        const result = new ApolloServer({
            typeDefs: importSchema('src/graphql/schema/schema.graphql'),
            resolvers,
            validationRules: [depthLimit(5)],
            context: (ctx: ReqContext) => {
                const { authorization } = ctx.req.headers
                if (authorization && typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
                    const token = authorization.substr(7)
                    const me = validateToken(token)
                    ctx.me = me
                }
                ctx.peopleFromHouseHoldLoader = PeopleFromHouseholdLoader.getLoader()
                ctx.householdLoader = HouseholdLoader.getLoader()

                return ctx
            },
        });
        return result;
    }
}