import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminService } from '../admin.service';

// Ported from the token checks in routes/admin.js and blogController.js.
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException({ error: 'Unauthorized' });
    }

    let decoded: { email?: string };
    try {
      decoded = this.adminService.verifyToken(token);
    } catch {
      throw new UnauthorizedException({ error: 'Unauthorized' });
    }

    if (decoded.email !== this.adminService.adminEmail) {
      throw new UnauthorizedException({ error: 'Unauthorized' });
    }

    return true;
  }
}
