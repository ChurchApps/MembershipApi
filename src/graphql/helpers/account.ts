import jwt from 'jsonwebtoken'

export interface IMe {
  id: string
  email: string
  churchId: string
  apiName: 'MembershipApi'
  permissions: string[]
  exp: number
}

export const validateToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY) as IMe
  } catch (error) {
    // console.log('Invalid user token: ', error)
    return null
  }

}