// The legacy controller read `email` straight from req.body and validated it
// manually (no schema validation middleware), so no class-validator
// decorators are applied here.
export class CreateSubscriptionDto {
  email?: string;
}
