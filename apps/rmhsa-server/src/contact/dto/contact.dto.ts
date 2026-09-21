// The legacy /submitContact route forwarded req.body straight into the email
// template, so no validation is applied here.
export class ContactDto {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
