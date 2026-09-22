import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/subscriptions.dto';
import { SubscriptionsService } from './subscriptions.service';

// Ported from routes/subscriptions.js (mounted at /api/subscriptions).
@ApiTags('subscriptions')
@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // GET /api/subscriptions
  @Get()
  @ApiOperation({ summary: 'List all user subscriptions' })
  @ApiResponse({ status: 200, description: 'Return all subscriptions.' })
  getSubscriptions() {
    return this.subscriptionsService.getSubscriptions();
  }

  // POST /api/subscriptions (legacy answered 200, not Nest's default 201).
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new email subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription created successfully.',
  })
  createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }
}
