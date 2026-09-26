import { ApiProperty } from '@nestjs/swagger';

// The legacy handlers read these fields straight from req.body and performed
// manual empty-field validation, so no class-validator decorators are applied
// here.
export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title', required: true })
  title?: string;

  @ApiProperty({ description: 'Notification description', required: false })
  desc?: string;

  @ApiProperty({ description: 'Notification body content', required: false })
  body?: string;

  @ApiProperty({
    description:
      'Type of notification (e.g., "blog", "manual", "announcement")',
    required: false,
  })
  type?: string;

  @ApiProperty({
    description:
      'Related blog post ID if this notification was created from a blog',
    required: false,
  })
  relatedBlogId?: string;
}

// PATCH spreads the raw request body over the stored document (any subset of
// the fields is accepted).
export class UpdateNotificationDto {
  @ApiProperty({ description: 'Notification title', required: false })
  title?: string;

  @ApiProperty({ description: 'Notification description', required: false })
  desc?: string;

  @ApiProperty({ description: 'Notification body content', required: false })
  body?: string;

  @ApiProperty({ description: 'Type of notification', required: false })
  type?: string;

  @ApiProperty({ description: 'Related blog post ID', required: false })
  relatedBlogId?: string;
}
