import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        this.logger.debug(`Request URL: ${request.url}`);
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            this.logger.error(`Auth error: ${err?.message}, info: ${info?.message}`);
            throw err || new UnauthorizedException();
        }
        return user;
    }
}