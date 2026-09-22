import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notifications.dto';
import { NotificationsService } from './notifications.service';

// Ported from routes/notifications.js (mounted at /api/notifications).
@ApiTags('notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /api/notifications?page=&limit=
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiOperation({ summary: 'List all notifications with optional pagination' })
  @ApiResponse({ status: 200, description: 'Return all notifications.' })
  getNotifications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getNotifications(page, limit);
  }

  // GET /api/notifications/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a single notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the specified notification.',
  })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  getNotification(@Param('id') id: string) {
    return this.notificationsService.getNotification(id);
  }

  // POST /api/notifications. Legacy quirk kept for parity: unlike the blogs
  // route, this endpoint performs NO token check at all.
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification created successfully.',
  })
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    const emptyFields: string[] = [];

    if (!createNotificationDto.title) {
      emptyFields.push('title');
    }
    if (!createNotificationDto.desc) {
      emptyFields.push('desc');
    }
    if (!createNotificationDto.body) {
      emptyFields.push('body');
    }

    if (emptyFields.length > 0) {
      throw new BadRequestException({
        error: 'Please fill in all the fields',
        emptyFields,
      });
    }

    return this.notificationsService.createNotification(createNotificationDto);
  }

  // DELETE /api/notifications/:id
  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Delete a notification (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  // PATCH /api/notifications/:id
  @Patch(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Update a notification (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  updateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.updateNotification(
      id,
      updateNotificationDto,
    );
  }
}
