import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscribe, SubscribeSchema } from './schemas/subscribe.schema';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscribe.name, schema: SubscribeSchema },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  // Re-exported so Blogs/Notifications can read subscribers' emails, the way
  // the legacy controllers required subscribeModel directly.
  exports: [MongooseModule],
})
export class SubscriptionsModule {}
