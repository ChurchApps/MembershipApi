import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'
import { ReqContext } from "../graphql/types";

export const isAuthenticated = (parent: null, args: any, { me }: ReqContext) =>
  me && me.id ? skip : new AuthenticationError('Not authenticated as user')

