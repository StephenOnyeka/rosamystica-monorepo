import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/admin.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.adminService.login(loginDto);
  }

  // Token verification mirrors the legacy GET /api/admin/verify route.
  @Get('verify')
  @UseGuards(AdminAuthGuard)
  verify(): { message: string } {
    return { message: 'Token is valid' };
  }

  @Post('logout')
  @HttpCode(200)
  logout(): { message: string } {
    return this.adminService.logout();
  }
}
