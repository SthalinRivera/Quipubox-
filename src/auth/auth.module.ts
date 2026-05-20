import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [
        ConfigModule, // ✅ Importa explícitamente ConfigModule
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
                if (!secret || !expiresIn) {
                    throw new Error('JWT_SECRET o JWT_EXPIRES_IN faltan en .env');
                }
                return {
                    secret,
                    signOptions: { expiresIn: expiresIn as any },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,    // ✅ Agrega PrismaService como provider
        GoogleStrategy,
        JwtStrategy,
    ],
})
export class AuthModule { }