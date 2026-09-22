import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/admin.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate admin user and receive JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Return JWT token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.adminService.login(loginDto);
  }

  // Token verification mirrors the legacy GET /api/admin/verify route.
  @Get('verify')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Verify JWT token validity' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token.' })
  verify(): { message: string } {
    return { message: 'Token is valid' };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout admin user' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  logout(): { message: string } {
    return this.adminService.logout();
  }
}
