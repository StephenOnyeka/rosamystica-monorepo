import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    // Provides the admin guard's dependencies used on POST.
    SubscriptionsModule,
    // Publishing a blog creates a notification (and sends the email) there.
    NotificationsModule,
    AdminModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
