import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // bodyParser: false so the 200mb limits below replace Nest's defaults
  // (mirrors the legacy Express setup).
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Mirror the original Express middleware stack: open CORS, 200mb body
  // limits, then a request logger (path + method).
  app.enableCors();
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ limit: '200mb', extended: true }));
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.log(`${req.path} ${req.method}`);
    next();
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Server is running on http://localhost:${port}`);
}
void bootstrap();
