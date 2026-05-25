// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';

let cachedHandler: any;

async function bootstrap() {
    const expressApp = express();
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn', 'log'] },
    );

    const configService = app.get(ConfigService);
    const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    app.enableCors({ origin: frontendUrl, credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
    return serverless(expressApp);
}

export const handler = async (event: any, context: any) => {
    if (!cachedHandler) {
        cachedHandler = await bootstrap();
    }
    return cachedHandler(event, context);
};