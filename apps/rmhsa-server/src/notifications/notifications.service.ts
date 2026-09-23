import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { Subscribe } from '../subscriptions/entities/subscribe.entity';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notifications.dto';
import { Notification } from './entities/notification.entity';

export interface PaginatedNotifications {
  notifications: Notification[];
  totalPosts: number;
  totalPages: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
    private readonly mailService: MailService,
  ) {}

  // Ported from notificationController.js: getNotifications (paginated list).
  async getNotifications(
    page?: string,
    limit?: string,
  ): Promise<PaginatedNotifications> {
    const currentPage = parseInt(page ?? '') || 1; // Current page number
    const perPage = parseInt(limit ?? '') || 5; // Number of notifications per page
    const skip = (currentPage - 1) * perPage; // Documents to skip

    try {
      // Fetch notifications with pagination
      const [notifications, totalPosts] =
        await this.notificationRepository.findAndCount({
          order: { createdAt: 'DESC' },
          skip,
          take: perPage,
        });

      // Calculate total pages
      const totalPages = Math.ceil(totalPosts / perPage);

      return { notifications, totalPosts, totalPages };
    } catch (error) {
      throw new InternalServerErrorException({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Ported from notificationController.js: getNotification (single item).
  async getNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id } as any,
    });

    if (!notification) {
      throw new NotFoundException({ error: 'No such notification' });
    }

    return notification;
  }

  // Ported from notificationController.js: createNotification.
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const { title, desc, body } = createNotificationDto;

    try {
      // Add doc to db
      const notification = await this.notificationRepository.save({
        title,
        desc,
        body,
      });

      // Fetch subscribers' emails
      const subscribers = await this.subscribeRepository.find();
      const subscriberEmails = subscribers
        .map((sub) => sub.email)
        .filter((email): email is string => !!email);

      // Send email notification
      await this.mailService.sendNotificationNotification(
        subscriberEmails,
        notification,
      );

      return notification;
    } catch (error) {
      throw new BadRequestException({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Ported from notificationController.js: deleteNotification.
  async deleteNotification(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id } as any,
    });

    if (!notification) {
      throw new NotFoundException({ error: 'No such notification' });
    }

    await this.notificationRepository.delete(id);

    return notification;
  }

  // Ported from notificationController.js: updateNotification.
  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id } as any,
    });

    if (!notification) {
      throw new NotFoundException({ error: 'No such notification' });
    }

    Object.assign(notification, updateNotificationDto);
    return this.notificationRepository.save(notification);
  }
}
