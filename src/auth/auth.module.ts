import { Module } from '@nestjs/common';

import { PassportModule }
    from '@nestjs/passport';

import { ConfigModule }
    from '@nestjs/config';

import { AuthController }
    from './auth.controller';

import { AuthService }
    from './auth.service';

import { JwtStrategy }
    from './jwt.strategy';

import { PrismaService }
    from '../prisma/prisma.service';


@Module({

    imports: [
        ConfigModule,
        PassportModule,
    ],

    controllers: [
        AuthController,
    ],

    providers: [

        AuthService,

        JwtStrategy,

        PrismaService,
    ],
})
export class AuthModule { }