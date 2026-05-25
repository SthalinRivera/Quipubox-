import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class JwtStrategy {
    private readonly logger = new Logger(JwtStrategy.name);
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

        // ✅ Validación explícita para que TypeScript sepa que no son undefined
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async validate(req: Request) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await this.supabase.auth.getUser(token);

        if (error || !user) {
            this.logger.error(`Token inválido: ${error?.message}`);
            throw new UnauthorizedException('Invalid token');
        }

        return {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
            app_metadata: user.app_metadata,
        };
    }
}