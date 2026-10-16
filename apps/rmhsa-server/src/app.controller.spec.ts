import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockDataSource = {
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: 'DataSource',
          useValue: mockDataSource,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root liveness', () => {
    it('should return liveness status UP', () => {
      const res = appController.getLiveness();
      expect(res.status).toBe('UP');
      expect(typeof res.uptime).toBe('number');
      expect(typeof res.timestamp).toBe('string');
    });
  });

  describe('health readiness', () => {
    it('should return readiness status UP when DB is connected', async () => {
      const res = await appController.getReadiness();
      expect(res.status).toBe('UP');
      expect(res.database.status).toBe('connected');
    });
  });
});
