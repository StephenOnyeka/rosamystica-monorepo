import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'Blog post title', required: true })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({ description: 'Blog post description', required: true })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  desc: string;

  @ApiProperty({ description: 'Blog post body content', required: true })
  // Matches the Schema.Types.Mixed body in models/blogModel.js (string or TipTap JSON)
  @IsNotEmpty({ message: 'Body content is required' })
  body: unknown;

  @ApiProperty({ description: 'Primary image URL or base64', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Cover image URL or base64', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({
    description: 'Background image URL or base64',
    required: false,
  })
  @IsOptional()
  @IsString()
  backgroundImage?: string;
}

// PATCH spreads the raw request body over the stored document (any subset of
// the fields is accepted).
export class UpdateBlogDto {
  @ApiProperty({ description: 'Blog post title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Blog post description', required: false })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({ description: 'Blog post body content', required: false })
  @IsOptional()
  body?: unknown;

  @ApiProperty({ description: 'Primary image URL or base64', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Cover image URL or base64', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({
    description: 'Background image URL or base64',
    required: false,
  })
  @IsOptional()
  @IsString()
  backgroundImage?: string;
}
