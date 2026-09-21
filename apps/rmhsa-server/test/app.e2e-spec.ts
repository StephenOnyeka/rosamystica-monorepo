import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';

// NOTE: AppModule connects to MongoDB on boot (MONGO_URI), so a full-module
// e2e run would require a live database. This spec boots the HTTP layer with
// the health-check controller only, which mirrors the legacy '/' health check
// route of the Express server.
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ message: 'Server is running successfully', status: 'OK' });
  });

  afterEach(async () => {
    await app.close();
  });
});
