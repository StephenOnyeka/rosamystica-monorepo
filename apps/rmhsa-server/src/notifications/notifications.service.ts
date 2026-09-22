import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { Subscribe } from '../subscriptions/schemas/subscribe.schema';
import { 
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notifications.dto';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

export interface PaginatedNotifications {
  notifications: NotificationDocument[];
  totalPosts: number;
  totalPages: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(Subscribe.name)
    private readonly subscribeModel: Model<Subscribe>,
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
      const notifications = await this.notificationModel
        .find({})
        .sort({ createdAt: -1 }) // Sort by creation date
        .skip(skip) // Skip the previous pages
        .limit(perPage); // Limit the number of notifications returned

      // Get the total count of notifications
      const totalPosts = await this.notificationModel.countDocuments();

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
  async getNotification(id: string): Promise<NotificationDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({ error: 'No such notification' });
    }

    const notification = await this.notificationModel.findById(id);

    if (!notification) {
      throw new BadRequestException({ error: 'No such notification' });
    }

    return notification;
  }

  // Ported from notificationController.js: createNotification. Creation
  // failures answer 400 { error } (unlike blogs, whose catch answered 401).
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationDocument> {
    const { title, desc, body } = createNotificationDto;

    try {
      // Add doc to db
      const notification = await this.notificationModel.create({
        title,
        desc,
        body,
      });

      // Fetch subscribers' emails
      const subscribers = await this.subscribeModel.find({}).select('email');
      const subscriberEmails = subscribers.map((sub) => sub.email);

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
  async deleteNotification(id: string): Promise<NotificationDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({ error: 'No such notification' });
    }

    const notification = await this.notificationModel.findByIdAndDelete(id);

    if (!notification) {
      throw new BadRequestException({ error: 'No such notification' });
    }

    return notification;
  }

  // Ported from notificationController.js: updateNotification. Runs without
  // { new: true }, so the pre-update document is returned (legacy behavior).
  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({ error: 'No such notification' });
    }

    const notification = await this.notificationModel.findByIdAndUpdate(id, {
      ...updateNotificationDto,
    });

    if (!notification) {
      throw new BadRequestException({ error: 'No such notification' });
    }

    return notification;
  }
}
