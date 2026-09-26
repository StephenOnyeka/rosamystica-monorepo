import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlogNotificationService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates a notification when a blog is published by calling the Notifications API
   * This avoids circular dependencies between BlogsModule and NotificationsModule
   */
  async createNotificationFromBlog(blog: any): Promise<void> {
    try {
      const apiUrl = `${this.configService.get('API_URL', 'http://localhost:3000')}/api/notifications`;

      const notificationData = {
        title: blog.title,
        desc: blog.desc || blog.title.substring(0, 100),
        body: blog.body || '',
        icon: '/images/favicon.ico',
        type: 'blog',
        relatedBlogId: blog.id,
      };

      // Make HTTP request to create notification
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      console.log(`Notification created for blog: ${blog.title}`);
    } catch (error) {
      console.error('Failed to create notification from blog:', error?.message);
      // Don't throw - we don't want to break blog creation if notification fails
    }
  }
}
