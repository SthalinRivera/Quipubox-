import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('No token');
        }
        const token = authHeader.replace('Bearer ', '');
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');

        // ✅ Importación dinámica (ESM)
        const jose = await import('jose');

        const JWKS = jose.createRemoteJWKSet(
            new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
        );

        const { payload } = await jose.jwtVerify(token, JWKS, {
            algorithms: ['ES256'],
        });

        request.user = {
            id: payload.sub,
            email: payload.email,
            user_metadata: payload.user_metadata,
            app_metadata: payload.app_metadata,
        };
        return true;
    }
}