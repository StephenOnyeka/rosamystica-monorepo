import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

// Ported from models/blogModel.js: timestamps on, body accepts any kind of
// data (Schema.Types.Mixed) and the collection stays 'blogs'.
@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  desc?: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  body: any;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: false })
  coverImage?: string;

  @Prop({ required: false })
  backgroundImage?: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
