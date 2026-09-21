import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from './dto/subscriptions.dto';
import { Subscribe, SubscribeDocument } from './schemas/subscribe.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscribe.name)
    private readonly subscribeModel: Model<Subscribe>,
  ) {}

  // Ported from subscribeController.js: getSubscriptions.
  async getSubscriptions(): Promise<SubscribeDocument[]> {
    const subs = await this.subscribeModel.find({});
    return subs;
  }

  // Ported from subscribeController.js: createSubscription.
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ mssg: string; subscription: SubscribeDocument }> {
    const { email } = createSubscriptionDto;

    // Validate the email format. Safety deviation: the legacy code ran the
    // same check on the raw req.body value but crashed before reaching it
    // when `email` was missing; answering 400 keeps the documented shape.
    if (!email || !email.includes('@') || !email.includes('.com')) {
      throw new BadRequestException({ error: 'Invalid email format' });
    }

    // Check if the email already exists
    const existingSubscription = await this.subscribeModel.findOne({ email });
    if (existingSubscription) {
      throw new BadRequestException({ warn: 'Email is already subscribed' });
    }

    // Add doc to db
    try {
      const subscription = await this.subscribeModel.create({ email });
      return { mssg: 'Subscribed successfully', subscription };
    } catch (error) {
      throw new BadRequestException({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
