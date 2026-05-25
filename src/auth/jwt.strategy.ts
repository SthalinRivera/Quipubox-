import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(private configService: ConfigService) { }

    async validate(req: Request) {
        // 1. Importación dinámica de 'jose' (solo lo que necesitas)
        const { jwtVerify, createRemoteJWKSet } = await import('jose');

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new Error('No token');
        }

        const token = authHeader.replace('Bearer ', '');

        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const JWKS = createRemoteJWKSet(
            new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
        );

        const { payload } = await jwtVerify(token, JWKS, {
            algorithms: ['ES256'],
        });

        return {
            id: payload.sub,
            email: payload.email,
            user_metadata: payload.user_metadata,
            app_metadata: payload.app_metadata,
        };
    }
}