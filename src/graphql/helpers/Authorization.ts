import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { AuthenticatedUser, Principal } from '../../apiBase/auth';
import { ReqContext } from "../types";
import jwt from 'jsonwebtoken'
import { IPermission } from '../../apiBase';

export interface IMe {
  id: string
  email: string
  churchId: string
  apiName: 'MembershipApi'
  permissions: string[]
  exp: number
};

export class Authorization {
  static requireAuthentication = (parent: null, args: any, ctx: ReqContext) => {
    const { me } = ctx
    if (!me || !me.id) return new AuthenticationError('Please log in')
    ctx.au = new AuthenticatedUser(new Principal(me))
    // return skip
  }

  static requirePermission = (me: IMe, permission: IPermission) => {
    if (!me || !me.id) return new AuthenticationError('Please log in')
    const au = new AuthenticatedUser(new Principal(me))
    if (!au.checkAccess(permission)) throw new ForbiddenError('You are not authenticated for this resources');
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

