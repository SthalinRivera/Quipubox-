import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import serverless from 'serverless-http';

let cachedServer: any;

async function bootstrapServerless() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.init();
  return serverless(app.getHttpAdapter().getInstance());
}

// ✅ Para entorno local (no Vercel)
if (process.env.NODE_ENV !== 'production') {
  async function startLocal() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 4000);
    await app.listen(port);
    Logger.log(`🚀 Servidor local corriendo en http://localhost:${port}`);
  }
  startLocal();
}

// ✅ Exportación necesaria para Vercel
export const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServerless();
  }
  return cachedServer(event, context);
};