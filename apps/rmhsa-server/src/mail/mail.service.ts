import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import { Resend } from 'resend';

interface MailContent {
  title: string;
  desc?: string;
  body?: string;
  image?: string | null;
  coverImage?: string | null;
  backgroundImage?: string | null;
  id: string; // UUID
}

const decodeEntities = (s: string): string =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// Turn a rich-text body into plain paragraphs.
const toParagraphs = (html: string = ''): string[] =>
  html
    .split(/<\/(?:p|div|li|h[1-6]|blockquote)>|<br\s*\/?>/i)
    .map((chunk) => decodeEntities(chunk.replace(/<[^>]*>/g, '')))
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

const countWords = (s: string): number => s.split(/\s+/).filter(Boolean).length;

// Keep whole paragraphs up to ~maxWords; if the last one overflows, cut it at
// the nearest sentence end (or add an ellipsis) so it never stops mid-thought.
const makeExcerpt = (
  html: string = '',
  maxWords = 120,
): { paragraphs: string[]; readMinutes: number; truncated: boolean } => {
  const all = toParagraphs(html);
  const total = all.reduce((n, p) => n + countWords(p), 0);
  const out: string[] = [];
  let used = 0;
  let truncated = false;

  for (const p of all) {
    const w = countWords(p);
    if (used + w <= maxWords) {
      out.push(p);
      used += w;
      continue;
    }
    const room = maxWords - used;
    if (room >= 15 || out.length === 0) {
      const cut = p.split(' ').slice(0, room).join(' ');
      const lastEnd = Math.max(
        cut.lastIndexOf('. '),
        cut.lastIndexOf('! '),
        cut.lastIndexOf('? '),
      );
      out.push(
        lastEnd > cut.length * 0.5
          ? cut.slice(0, lastEnd + 1)
          : `${cut.replace(/[,;:\s]+$/, '')}…`,
      );
    }
    truncated = true;
    break;
  }

  return {
    paragraphs: out,
    readMinutes: Math.max(1, Math.round(total / 200)),
    truncated,
  };
};

export interface ContactMessage {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const escapeHtml = (value: string = ''): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly gmailTransporter: Transporter;

  private get siteUrl(): string {
    return (
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000'
    ).replace(/\/$/, '');
  }

  // Shared branded layout for subscriber alert emails. The title appears once
  // (the subject line already carries it), followed by a readable excerpt.
  private buildAlertHtml(opts: {
    label: string;
    title: string;
    paragraphs: string[];
    meta?: string;
    image?: string | null;
    url: string;
    cta: string;
  }): string {
    const { label, title, paragraphs, meta, image, url, cta } = opts;
    const safeImage =
      image && /^https?:\/\//i.test(image) ? escapeHtml(image) : '';
    const body = paragraphs
      .map(
        (p) =>
          `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#374151;">${escapeHtml(p)}</p>`,
      )
      .join('');
    return `
<div style="background:#f4f4f7;padding:24px 12px;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
    <tr><td style="height:6px;background:#5b21b6;font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="padding:20px 32px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#5b21b6;font-weight:bold;">Rosa Mystica High School</td></tr>
    ${safeImage ? `<tr><td style="padding:16px 32px 0;"><img src="${safeImage}" alt="" width="536" style="display:block;width:100%;max-width:536px;height:auto;border-radius:10px;" /></td></tr>` : ''}
    <tr><td style="padding:24px 32px 8px;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">${escapeHtml(label)}${meta ? ` &middot; ${escapeHtml(meta)}` : ''}</div>
      <h1 style="margin:0 0 18px;font-size:28px;line-height:1.25;color:#111827;">${escapeHtml(title)}</h1>
      ${body}
      <a href="${url}" style="display:inline-block;margin:8px 0 20px;background:#5b21b6;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:8px;">${escapeHtml(cta)} &rarr;</a>
    </td></tr>
    <tr><td style="padding:18px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;color:#9ca3af;font-size:12px;line-height:1.5;">
      You are receiving this because you subscribed to updates from Rosa Mystica High School.
    </td></tr>
  </table>
</div>`;
  }

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
      const blogExcerpt = makeExcerpt(blog.body || blog.desc);
      await this.gmailTransporter.sendMail({
        from: `"Rosa Mystica Blogs" <${gmailUser}>`,
        to: subscribers.join(','),
        subject: `New Blog Post: ${blog.title}`,
        text: `${blog.title}\n\n${blogExcerpt.paragraphs.join('\n\n')}\n\nRead the full article: ${this.siteUrl}/blogs/${blog.id}`,
        html: this.buildAlertHtml({
          label: 'New Blog Post',
          title: blog.title,
          paragraphs: blogExcerpt.paragraphs,
          meta: `${blogExcerpt.readMinutes} min read`,
          image: blog.coverImage || blog.backgroundImage || blog.image,
          url: `${this.siteUrl}/blogs/${blog.id}`,
          cta: 'Continue reading',
        }),
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
      const noteExcerpt = makeExcerpt(notification.body || notification.desc);
      await this.gmailTransporter.sendMail({
        from: `"Rosa Mystica Notifications" <${gmailUser}>`,
        to: subscribers.join(','),
        subject: `Notification: ${notification.title}`,
        text: `${notification.title}\n\n${noteExcerpt.paragraphs.join('\n\n')}\n\nView announcement: ${this.siteUrl}/notifications?id=${notification.id}`,
        html: this.buildAlertHtml({
          label: 'Announcement',
          title: notification.title,
          paragraphs: noteExcerpt.paragraphs,
          url: `${this.siteUrl}/notifications?id=${notification.id}`,
          cta: 'View announcement',
        }),
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
