import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from '../admin/admin.module';
import { MailModule } from '../mail/mail.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    // Provides the Subscribe model (for subscriber emails) and the admin
    // guard used on POST.
    SubscriptionsModule,
    MailModule,
    AdminModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
