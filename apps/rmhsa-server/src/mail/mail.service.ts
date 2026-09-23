import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import { Resend } from 'resend';

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
  private readonly resend: Resend;
  private readonly gmailTransporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(resendApiKey);

    const gmailUser =
      this.configService.get<string>('GMAIL_USER') ??
      'rosamysticahsa@gmail.com';
    const gmailPass = this.configService.get<string>('GMAIL_PASS');

    this.gmailTransporter = createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  // Notify subscribers about a new blog post via Nodemailer (Gmail SMTP).
  async sendBlogNotification(
    subscribers: string[],
    blog: MailContent,
  ): Promise<void> {
    try {
      const gmailUser =
        this.configService.get<string>('GMAIL_USER') ??
        'rosamysticahsa@gmail.com';
      await this.gmailTransporter.sendMail({
        from: `"Rosa Mystica Blogs" <${gmailUser}>`,
        to: subscribers.join(','),
        subject: `New Blog Post: ${blog.title}`,
        text: 'Hello',
        html: `<p>A new blog post has been published!</p><p><strong>Title:</strong> ${blog.title}</p><p><strong>Description:</strong> ${blog.desc}</p><p><a href="http://localhost:3000/blogs/${blog.id}">Read more</a></p>`,
      });
      this.logger.log(
        'Blog notification email sent successfully via Gmail SMTP!',
      );
    } catch (error) {
      this.logger.error(
        `Error sending blog notification email: ${String(error)}`,
      );
    }
  }

  // Notify subscribers about a new notification alert via Nodemailer (Gmail SMTP).
  async sendNotificationNotification(
    subscribers: string[],
    notification: MailContent,
  ): Promise<void> {
    try {
      const gmailUser =
        this.configService.get<string>('GMAIL_USER') ??
        'rosamysticahsa@gmail.com';
      await this.gmailTransporter.sendMail({
        from: `"Rosa Mystica Notifications" <${gmailUser}>`,
        to: subscribers.join(','),
        subject: `Notification: ${notification.title}`,
        text: 'Hello',
        html: `<p>A new notification post has been published!</p><p><strong>Title:</strong> ${notification.title}</p><p><strong>Description:</strong> ${notification.desc}</p><p><a href="http://localhost:3000/notifications/${notification.id}">Read more</a></p>`,
      });
      this.logger.log(
        'Notification alert email sent successfully via Gmail SMTP!',
      );
    } catch (error) {
      this.logger.error(
        `Error sending notification alert email: ${String(error)}`,
      );
    }
  }

  // Send contact form email using Resend API.
  async sendContactEmail(message: ContactMessage): Promise<void> {
    const fromEmail =
      this.configService.get<string>('RESEND_FROM_EMAIL') ||
      'Rosa Mystica School <onboarding@resend.dev>';

    const { data, error } = await this.resend.emails.send({
      from: fromEmail,
      to: ['rosamysticahsa@gmail.com', 'paulczie77@gmail.com'],
      subject: message.subject || 'Message from the contact form',
      text: message.message || 'Contact form submission',
      html: `
  <p>You have a new message from your school website</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: <b>${message.name ?? 'N/A'}</b></li>
    <li>Email: ${message.email ?? 'N/A'}</li>
    <li>Subject: <b>${message.subject ?? 'N/A'}</b></li>
    <li>Message: ${message.message ?? ''}</li>
  </ul>`,
    });

    if (error) {
      this.logger.error(
        `Resend error sending contact email: ${JSON.stringify(error)}`,
      );
      throw new Error(
        `Failed to send contact email via Resend: ${error.message}`,
      );
    }

    this.logger.log(`Contact email sent successfully via Resend: ${data?.id}`);
  }
}
