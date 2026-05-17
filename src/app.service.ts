import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return '🚀 Quipubox API Running - Sistema en desarrollo';
  }

  getStatus() {
    return {
      app: 'Quipubox',
      status: 'OK',
      version: '1.0.0',
      date: new Date(),
    };
  }

  getInfo() {
    return {
      name: 'Quipubox System',
      description: 'Sistema de gestión de mercados y usuarios',
      backend: 'NestJS + Prisma',
    };
  }
}