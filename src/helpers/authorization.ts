import { AuthenticationError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'
import { Permissions } from '../helpers/Permissions';
import { AuthenticatedUser, Principal } from '../apiBase/auth';
import { ReqContext } from "../graphql/types";

export const isAuthenticated = (parent: null, args: any, ctx: ReqContext) => {
  const { me } = ctx
  if (!me || !me.id) {
    return new AuthenticationError('Not authenticated as user')
  }
  ctx.au = new AuthenticatedUser(new Principal(me))

  return skip
}

export const requireAccess = (parent: null, args: any, { me }: ReqContext) => (permission: any[]) => {


  return skip
}
