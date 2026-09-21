import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscribeDocument = HydratedDocument<Subscribe>;

// Ported from models/subscribeModel.js. The legacy schema declares no
// timestamps, so createdAt/updatedAt must stay absent (the collection name
// 'subscribes' matches what mongoose generated from the model name).
@Schema({ collection: 'subscribes' })
export class Subscribe {
  @Prop({ required: false })
  email: string;
}

export const SubscribeSchema = SchemaFactory.createForClass(Subscribe);
