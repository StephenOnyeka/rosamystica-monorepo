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
    const cookieToken =
      (request as any).cookies?.token ||
      this.extractCookie(request.headers.cookie, 'token');
    const bearerToken = request.headers.authorization?.split(' ')[1];
    const token = cookieToken || bearerToken;

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

  private extractCookie(
    cookieHeader?: string,
    name: string = 'token',
  ): string | null {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }
}
