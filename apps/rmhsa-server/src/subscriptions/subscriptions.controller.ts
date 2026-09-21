import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/subscriptions.dto';
import { SubscriptionsService } from './subscriptions.service';

// Ported from routes/subscriptions.js (mounted at /api/subscriptions).
@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // GET /api/subscriptions
  @Get()
  getSubscriptions() {
    return this.subscriptionsService.getSubscriptions();
  }

  // POST /api/subscriptions (legacy answered 200, not Nest's default 201).
  @Post()
  @HttpCode(200)
  createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }
}
