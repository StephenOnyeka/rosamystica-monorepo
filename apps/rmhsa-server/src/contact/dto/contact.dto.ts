import { ApiProperty } from '@nestjs/swagger';

// The legacy /submitContact route forwarded req.body straight into the email
// template, so no validation is applied here.
export class ContactDto {
  @ApiProperty({ description: 'User name', required: false })
  name?: string;

  @ApiProperty({ description: 'User email', required: false })
  email?: string;

  @ApiProperty({ description: 'Message subject', required: false })
  subject?: string;

  @ApiProperty({ description: 'Message content', required: false })
  message?: string;
}
