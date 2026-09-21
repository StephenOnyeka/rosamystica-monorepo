import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; status: string } {
    return { message: 'Server is running successfully', status: 'OK' };
  }
}
