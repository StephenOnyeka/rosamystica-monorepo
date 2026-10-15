import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title', required: true })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({ description: 'Notification description', required: false })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({ description: 'Notification body content', required: false })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    description:
      'Type of notification (e.g., "blog", "manual", "announcement")',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description:
      'Related blog post ID if this notification was created from a blog',
    required: false,
  })
  @IsOptional()
  @IsString()
  relatedBlogId?: string;
}

// PATCH spreads the raw request body over the stored document (any subset of
// the fields is accepted).
export class UpdateNotificationDto {
  @ApiProperty({ description: 'Notification title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Notification description', required: false })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({ description: 'Notification body content', required: false })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ description: 'Type of notification', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Related blog post ID', required: false })
  @IsOptional()
  @IsString()
  relatedBlogId?: string;
}
