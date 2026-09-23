import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/subscriptions.dto';
import { Subscribe } from './entities/subscribe.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
  ) {}

  // Ported from subscribeController.js: getSubscriptions.
  async getSubscriptions(): Promise<Subscribe[]> {
    const subs = await this.subscribeRepository.find();
    return subs;
  }

  // Ported from subscribeController.js: createSubscription.
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<{ mssg: string; subscription: Subscribe }> {
    const { email } = createSubscriptionDto;

    // Validate the email format. Safety deviation: the legacy code ran the
    // same check on the raw req.body value but crashed before reaching it
    // when `email` was missing; answering 400 keeps the documented shape.
    if (!email || !email.includes('@') || !email.includes('.com')) {
      throw new BadRequestException({ error: 'Invalid email format' });
    }

    // Check if the email already exists
    const existingSubscription = await this.subscribeRepository.findOne({
      where: { email },
    });
    if (existingSubscription) {
      throw new BadRequestException({ warn: 'Email is already subscribed' });
    }

    // Add doc to db
    try {
      const subscription = await this.subscribeRepository.save({ email });
      return { mssg: 'Subscribed successfully', subscription };
    } catch (error) {
      throw new BadRequestException({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
