import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly dataSource: DataSource) {}

  // Liveness: Ultra-fast in-memory check to keep Render web service awake
  getLiveness(): {
    status: string;
    uptime: number;
    timestamp: string;
  } {
    return {
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  // Readiness & Keepalive: Runs SELECT 1 with 3-second timeout guard
  // Returns HTTP 200 on success, throws HTTP 503 Service Unavailable on failure
  async getReadiness(): Promise<{
    status: string;
    database: { status: string; latencyMs: number };
    timestamp: string;
  }> {
    const start = Date.now();
    try {
      await Promise.race([
        this.dataSource.query('SELECT 1'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database query timed out')), 3000),
        ),
      ]);

      const latencyMs = Date.now() - start;
      return {
        status: 'UP',
        database: {
          status: 'connected',
          latencyMs,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Database readiness check failed: ${String(error)}`);
      throw new ServiceUnavailableException({
        status: 'DOWN',
        database: {
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}
