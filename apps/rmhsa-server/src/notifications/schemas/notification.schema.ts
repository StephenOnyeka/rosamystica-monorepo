import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

// Ported from models/notificationModel.js: timestamps on, body is a plain
// string (unlike blogs, which use Schema.Types.Mixed).
@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  desc?: string;

  @Prop({ type: String, required: true })
  body: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
