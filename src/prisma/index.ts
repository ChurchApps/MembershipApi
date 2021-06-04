import { PrismaClient } from '@prisma/client'

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '123456',
  DB_DATABASE = 'membership',
  DB_PORT = 3306,
} = process.env

const url = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

export const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn'],
  datasources: {
    db: {
      url
    }
  }
})