import { PrismaClient } from '@prisma/client'

export class PrismaHelper {

    static existingClient: PrismaClient = null;

    static getClient = () => {
        if (PrismaHelper.existingClient === null) {
            const port = process.env.DB_PORT || 3306;
            const url = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${port}/${process.env.DB_DATABASE}`;
            PrismaHelper.existingClient = new PrismaClient({ datasources: { db: { url } } });
        }
        return PrismaHelper.existingClient;
    }

}