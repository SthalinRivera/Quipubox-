import 'dotenv/config';

import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
    connectionString,
});

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor() {
        super({
            adapter,
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

}