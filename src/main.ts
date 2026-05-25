import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
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

    const port = configService.get<number>('PORT', 4000);
    await app.listen(port);
    logger.log(`🚀 Aplicación corriendo en http://localhost:${port}`);
    logger.log(`🌐 CORS permitido para: ${frontendUrl}`);
  } catch (error) {
    // ✅ Corrección: manejar error de tipo unknown
    if (error instanceof Error) {
      Logger.error(`❌ Error al iniciar la aplicación: ${error.message}`, error.stack);
    } else {
      Logger.error(`❌ Error desconocido: ${String(error)}`);
    }
    process.exit(1);
  }
}

bootstrap();