import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // bodyParser: false so the 200mb limits below replace Nest's defaults
  // (mirrors the legacy Express setup).
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Global validation pipe using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Open CORS with credentials for httpOnly cookie support
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (
        !origin ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('https://localhost:') ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  });
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ limit: '200mb', extended: true }));
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.log(`${req.path} ${req.method}`);
    next();
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Rosa Mystica High School API')
    .setDescription(
      'API documentation for Rosa Mystica High School backend services',
    )
    .setVersion('1.0')
    .addTag('admin', 'Admin authentication and management endpoints')
    .addTag('blogs', 'Blog post management endpoints')
    .addTag('notifications', 'Notification management endpoints')
    .addTag('subscriptions', 'User subscription management endpoints')
    .addTag('contact', 'Contact form submission endpoint')
    .addTag('health', 'Health check endpoint')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  logger.log(`Server is running on http://localhost:${port}`);
  logger.log(
    `Swagger documentation available at http://localhost:${port}/api-docs`,
  );
}

void bootstrap();
