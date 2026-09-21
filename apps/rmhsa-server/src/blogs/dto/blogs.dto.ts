// The legacy handlers read these fields straight from req.body and performed
// manual empty-field validation, so no class-validator decorators are applied
// here.
export class CreateBlogDto {
  title?: string;
  desc?: string;
  // Matches the Schema.Types.Mixed body in models/blogModel.js.
  body?: unknown;
}

// PATCH spreads the raw request body over the stored document (any subset of
// the fields is accepted).
export class UpdateBlogDto {
  title?: string;
  desc?: string;
  body?: unknown;
}
