import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(private configService: ConfigService) {

        const supabaseJwtSecret = configService.get<string>('SUPABASE_JWT_SECRET');

        if (!supabaseJwtSecret) {
            throw new Error('Falta SUPABASE_JWT_SECRET en .env');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: supabaseJwtSecret,
            algorithms: ['HS256'], // Supabase usa HS256 para validación interna
        });

        this.logger.log('✅ JWT Strategy lista (sin jwks-rsa)');
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
            user_metadata: payload.user_metadata,
        };
    }
}