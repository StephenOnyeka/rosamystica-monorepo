import { ApiProperty } from '@nestjs/swagger';

// The legacy handlers read these fields straight from req.body and performed
// manual empty-field validation, so no class-validator decorators are applied
// here.
export class CreateBlogDto {
  @ApiProperty({ description: 'Blog post title', required: true })
  title?: string;

  @ApiProperty({ description: 'Blog post description', required: true })
  desc?: string;

  @ApiProperty({ description: 'Blog post body content', required: true })
  // Matches the Schema.Types.Mixed body in models/blogModel.js.
  body?: unknown;

  @ApiProperty({ description: 'Primary image URL or base64', required: false })
  image?: string;

  @ApiProperty({ description: 'Cover image URL or base64', required: false })
  coverImage?: string;

  @ApiProperty({ description: 'Background image URL or base64', required: false })
  backgroundImage?: string;
}

// PATCH spreads the raw request body over the stored document (any subset of
// the fields is accepted).
export class UpdateBlogDto {
  @ApiProperty({ description: 'Blog post title', required: false })
  title?: string;

  @ApiProperty({ description: 'Blog post description', required: false })
  desc?: string;

  @ApiProperty({ description: 'Blog post body content', required: false })
  body?: unknown;

  @ApiProperty({ description: 'Primary image URL or base64', required: false })
  image?: string;

  @ApiProperty({ description: 'Cover image URL or base64', required: false })
  coverImage?: string;

  @ApiProperty({ description: 'Background image URL or base64', required: false })
  backgroundImage?: string;
}
