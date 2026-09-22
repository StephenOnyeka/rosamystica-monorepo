import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscribe])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  // Re-exported so Blogs/Notifications can read subscribers' emails, the way
  // the legacy controllers required subscribeModel directly.
  exports: [TypeOrmModule],
})
export class SubscriptionsModule {}
