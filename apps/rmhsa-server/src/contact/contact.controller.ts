import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ContactDto } from './dto/contact.dto';

@Controller()
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly mailService: MailService) {}

  // Ported from index.js: POST /submitContact lives at the root (no /api
  // prefix) and always answers with a JSON object.
  @Post('submitContact')
  @HttpCode(200)
  async submitContact(
    @Body() contactDto: ContactDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.mailService.sendContactEmail(contactDto);
      return {
        success: true,
        message: 'Contact form submitted successfully!',
      };
    } catch (error) {
      this.logger.error(`Error sending email: ${String(error)}`);
      const responseBody = (error as { response?: { body?: string } }).response
        ?.body;
      if (responseBody) {
        this.logger.error(`Error response: ${String(responseBody)}`);
      }
      throw new InternalServerErrorException({
        success: false,
        error: 'Error sending email.',
      });
    }
  }
}
