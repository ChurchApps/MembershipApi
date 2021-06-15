import { AuthenticationError } from 'apollo-server'
import { skip } from 'graphql-resolvers'
import { AuthenticatedUser, Principal } from '../../apiBase/auth';
import { ReqContext } from "../types";
import jwt from 'jsonwebtoken'

export interface IMe {
  id: string
  email: string
  churchId: string
  apiName: 'MembershipApi'
  permissions: string[]
  exp: number
};

export class Authorization {
  static isAuthenticated = (parent: null, args: any, ctx: ReqContext) => {
    const { me } = ctx
    if (!me || !me.id) return new AuthenticationError('Not authenticated as user')
    ctx.au = new AuthenticatedUser(new Principal(me))
    return skip
  }

  static requireAccess = (parent: null, args: any, { me }: ReqContext) => (permission: any[]) => {
    return skip
  }

  static validateToken = (token: string) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY) as IMe
    } catch (error) {
      // console.log('Invalid user token: ', error)
      return null
    }
  }

}

