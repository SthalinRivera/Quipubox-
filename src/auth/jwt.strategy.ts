import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(configService: ConfigService) {
        const jwtSecret = configService.get<string>('SUPABASE_JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('Falta SUPABASE_JWT_SECRET en .env');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret, // 👈 SIMPLE, SIN JWKS
        });

        this.logger.log('✅ JWT Strategy con secret configurado');
    }

    async validate(payload: any) {
        return {
            user: {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
            },
        };
    }
}