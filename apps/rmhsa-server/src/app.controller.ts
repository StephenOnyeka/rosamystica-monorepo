import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Liveness probe: Fast in-memory check to keep Render web service awake
  @Get()
  @ApiOperation({
    summary: 'Liveness probe (GET /)',
    description:
      'Ultra-fast in-memory check to keep the web service awake without database load.',
  })
  @ApiResponse({
    status: 200,
    description: 'Server process is alive and responding.',
  })
  getLiveness() {
    return this.appService.getLiveness();
  }

  // Readiness & Keepalive probe: Pings PostgreSQL database with a 3s timeout
  @Get('health')
  @ApiOperation({
    summary: 'Readiness & DB Keepalive probe (GET /health)',
    description:
      'Executes SELECT 1 on the database with a 3-second timeout. Returns 200 when DB is connected, 503 if unreachable.',
  })
  @ApiResponse({
    status: 200,
    description: 'Server and database are healthy and connected.',
  })
  @ApiResponse({
    status: 503,
    description: 'Database is unreachable or query timed out.',
  })
  getReadiness() {
    return this.appService.getReadiness();
  }
}
