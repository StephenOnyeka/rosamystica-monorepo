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
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notifications.dto';
import { NotificationsService } from './notifications.service';

// Ported from routes/notifications.js (mounted at /api/notifications).
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /api/notifications?page=&limit=
  @Get()
  getNotifications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getNotifications(page, limit);
  }

  // GET /api/notifications/:id
  @Get(':id')
  getNotification(@Param('id') id: string) {
    return this.notificationsService.getNotification(id);
  }

  // POST /api/notifications. Legacy quirk kept for parity: unlike the blogs
  // route, this endpoint performs NO token check at all.
  @Post()
  @HttpCode(200)
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
  deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  // PATCH /api/notifications/:id
  @Patch(':id')
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
