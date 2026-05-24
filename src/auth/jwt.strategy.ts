import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(private configService: ConfigService) {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        if (!supabaseUrl) {
            throw new Error('Falta SUPABASE_URL en .env');
        }
        const jwksUri = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;

        // IMPORTANTE: ESTOS LOGS NO USAN 'this', pueden ir antes de super()
        console.log('🔍 Supabase URL:', supabaseUrl);
        console.log('🔍 JWKS URI:', jwksUri);

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            algorithms: ['ES256'], // ← CLAVE: Volver a ES256
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksUri: jwksUri,
            }),
        });

        // Estos logs ya pueden usar 'this'
        this.logger.log('✅ Estrategia JWT inicializada con ES256');
    }

    async validate(payload: any) {
        this.logger.debug('📦 Payload JWT recibido:', payload);
        return {
            user: {
                id: payload.sub,
                email: payload.email,
                user_metadata: payload.user_metadata || {},
                app_metadata: payload.app_metadata || {},
            }
        };
    }
}