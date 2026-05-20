import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Obtener tenant del subdominio: empresa.midominio.com
        const host = req.headers.host;
        let tenant = 'default';  // valor por defecto
        if (host) {
            const parts = host.split('.');
            if (parts.length >= 2 && parts[0] !== 'www') {
                tenant = parts[0];
            }
        }
        // También puedes recibir tenant en header X-Tenant-ID
        const headerTenant = req.headers['x-tenant-id'];
        if (headerTenant) {
            tenant = headerTenant as string;
        }
        req['tenant'] = tenant;
        next();
    }
}