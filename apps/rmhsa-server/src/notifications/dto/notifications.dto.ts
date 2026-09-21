// The legacy handlers read these fields straight from req.body and performed
// manual empty-field validation, so no class-validator decorators are applied
// here.
export class CreateNotificationDto {
  title?: string;
  desc?: string;
  body?: string;
}

// PATCH spreads the raw request body over the stored document (any subset of
// the fields is accepted).
export class UpdateNotificationDto {
  title?: string;
  desc?: string;
  body?: string;
}
