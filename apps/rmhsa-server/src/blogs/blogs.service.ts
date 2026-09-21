import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { Subscribe } from '../subscriptions/schemas/subscribe.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto/blogs.dto';
import { Blog, BlogDocument } from './schemas/blog.schema';

export interface PaginatedBlogs {
  blogs: BlogDocument[];
  totalPosts: number;
  totalPages: number;
}

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
    @InjectModel(Subscribe.name)
    private readonly subscribeModel: Model<Subscribe>,
    private readonly mailService: MailService,
  ) {}

  // Ported from blogController.js: getBlogs (paginated list).
  async getBlogs(page?: string, limit?: string): Promise<PaginatedBlogs> {
    const currentPage = parseInt(page ?? '') || 1; // Current page number
    const perPage = parseInt(limit ?? '') || 5; // Number of blogs per page
    const skip = (currentPage - 1) * perPage; // Documents to skip

    try {
      // Fetch blogs with pagination
      const blogs = await this.blogModel
        .find({})
        .sort({ createdAt: -1 }) // Sort by creation date
        .skip(skip) // Skip the previous pages
        .limit(perPage); // Limit the number of blogs returned

      // Get the total count of blogs
      const totalPosts = await this.blogModel.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalPosts / perPage);

      return { blogs, totalPosts, totalPages };
    } catch (error) {
      throw new InternalServerErrorException({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Ported from blogController.js: getBlog (single blog).
  async getBlog(id: string): Promise<BlogDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({ error: 'No such blog' });
    }

    const blog = await this.blogModel.findById(id);

    if (!blog) {
      throw new BadRequestException({ error: 'No such blog' });
    }

    return blog;
  }

  // Ported from blogController.js: createBlog. The legacy handler wrapped the
  // whole flow (db write + subscriber emails) in a catch that answered 401,
  // so any failure here keeps that exact shape.
  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogDocument> {
    const { title, desc } = createBlogDto;

    try {
      // Add doc to db
      const blog = await this.blogModel.create({
        title,
        desc,
        body: createBlogDto.body,
      });

      // Fetch subscribers' emails
      const subscribers = await this.subscribeModel.find({}).select('email');
      const subscriberEmails = subscribers.map((sub) => sub.email);

      // Send email notification
      await this.mailService.sendBlogNotification(subscriberEmails, blog);

      return blog;
    } catch {
      throw new UnauthorizedException({ error: 'Unauthorized' });
    }
  }

  // Ported from blogController.js: deleteBlog.
  async deleteBlog(id: string): Promise<BlogDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({ error: 'No such blog' });
    }

    const blog = await this.blogModel.findByIdAndDelete(id);

    if (!blog) {
      throw new BadRequestException({ error: 'No such blog' });
    }

    return blog;
  }

  // Ported from blogController.js: updateBlog. findOneAndUpdate runs without
  // { new: true }, so the pre-update document is returned (legacy behavior).
  async updateBlog(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({ error: 'No such blog' });
    }

    const blog = await this.blogModel.findByIdAndUpdate(id, {
      ...updateBlogDto,
    });

    if (!blog) {
      throw new BadRequestException({ error: 'No such blog' });
    }

    return blog;
  }
}
