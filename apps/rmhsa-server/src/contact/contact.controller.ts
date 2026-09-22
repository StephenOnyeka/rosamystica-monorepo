import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';
import { ContactDto } from './dto/contact.dto';

@ApiTags('contact')
@Controller()
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly mailService: MailService) {}

  // Ported from index.js: POST /submitContact lives at the root (no /api
  // prefix) and always answers with a JSON object.
  @Post('submitContact')
  @HttpCode(200)
  @ApiOperation({ summary: 'Submit contact form message' })
  @ApiResponse({ status: 200, description: 'Message sent successfully!' })
  @ApiResponse({ status: 500, description: 'Failed to send message.' })
  @ApiBody({ type: ContactDto })
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
