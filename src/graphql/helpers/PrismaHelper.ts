import { PrismaClient } from '@prisma/client'

export class PrismaHelper {

    static existingClient: PrismaClient = null;

    static getClient = () => {
        if (PrismaHelper.existingClient === null) {
            const url = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
            PrismaHelper.existingClient = new PrismaClient({ datasources: { db: { url } } });
        }
        return PrismaHelper.existingClient;
    }

}