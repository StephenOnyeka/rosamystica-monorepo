import { ApiProperty } from '@nestjs/swagger';

// The legacy controller read `email` straight from req.body and validated it
// manually (no schema validation middleware), so no class-validator
// decorators are applied here.
export class CreateSubscriptionDto {
  @ApiProperty({ description: 'User email address', required: true })
  email?: string;
}
