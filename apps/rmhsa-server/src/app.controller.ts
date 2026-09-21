import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Health check route (mirrors GET / in the legacy Express server).
  @Get()
  getHealth(): { message: string; status: string } {
    return this.appService.getHealth();
  }
}
