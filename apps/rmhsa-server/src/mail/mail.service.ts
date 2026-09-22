import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import BrevoTransport, {
  type BrevoMessageInfo,
} from 'nodemailer-brevo-transport';

interface MailContent {
  title: string;
  desc?: string;
  id: string; // UUID
}

export interface ContactMessage {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter<BrevoMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    // Mirror the legacy transporter: nodemailer with the Brevo transport.
    this.transporter = createTransport(
      new BrevoTransport({
        apiKey: this.configService.get<string>('BREVO_API'),
      }),
    );
  }

  // Ported from emailService.js: notify subscribers about a new blog post.
  async sendBlogNotification(
    subscribers: string[],
    blog: MailContent,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"Rosa Mystica Blogs" <rosamysticahsa@gmail.com>',
        to: subscribers.join(','),
        subject: `New Blog Post: ${blog.title}`,
        text: 'Hello',
        html: `<p>A new blog post has been published!</p><p><strong>Title:</strong> ${blog.title}</p><p><strong>Description:</strong> ${blog.desc}</p><p><a href="http://localhost:3000/blogs/${blog.id}">Read more</a></p>`,
      });
      this.logger.log('Email sent successfully!');
    } catch (error) {
      this.logger.error(`Error sending email: ${String(error)}`);
    }
  }

  // Ported from notificationService.js: notify subscribers about a new
  // notification.
  async sendNotificationNotification(
    subscribers: string[],
    notification: MailContent,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"Rosa Mystica Notifications" <rosamysticahsa@gmail.com>',
        to: subscribers.join(','),
        subject: `Notification: ${notification.title}`,
        text: 'Hello',
        html: `<p>A new notification post has been published!</p><p><strong>Title:</strong> ${notification.title}</p><p><strong>Description:</strong> ${notification.desc}</p><p><a href="http://localhost:3000/notifications/${notification.id}">Read more</a></p>`,
      });
      this.logger.log('Email sent successfully!');
    } catch (error) {
      this.logger.error(`Error sending email: ${String(error)}`);
    }
  }

  // Ported from index.js: contact form email. Errors propagate to the caller.
  async sendContactEmail(message: ContactMessage): Promise<void> {
    const info = await this.transporter.sendMail({
      from: '"School Mailer" <rosamysticahsa@gmail.com>',
      to: 'rosamysticahsa@gmail.com , paulczie77@gmail.com',
      subject: 'Message from the contact form',
      text: 'Hello world?',
      html: `
  <p>You have a new message from your school website</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: <b>${message.name}</b></li>
    <li>Email: ${message.email}</li>
    <li>Subject: <b>${message.subject}</b></li>
    <li>Message: ${message.message}</li>
  </ul>`,
    });
    this.logger.log(`Message sent: ${info.messageId}`);
  }
}
