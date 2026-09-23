import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { Subscribe } from '../subscriptions/entities/subscribe.entity';
import { CreateBlogDto, UpdateBlogDto } from './dto/blogs.dto';
import { Blog } from './entities/blog.entity';

export interface PaginatedBlogs {
  blogs: Blog[];
  totalPosts: number;
  totalPages: number;
}

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
    private readonly mailService: MailService,
  ) {}

  // Ported from blogController.js: getBlogs (paginated list).
  async getBlogs(page?: string, limit?: string): Promise<PaginatedBlogs> {
    const currentPage = parseInt(page ?? '') || 1; // Current page number
    const perPage = parseInt(limit ?? '') || 5; // Number of blogs per page
    const skip = (currentPage - 1) * perPage; // Documents to skip

    try {
      // Fetch blogs with pagination
      const [blogs, totalPosts] = await this.blogRepository.findAndCount({
        order: { createdAt: 'DESC' },
        skip,
        take: perPage,
      });

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
  async getBlog(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException({ error: 'No such blog' });
    }

    return blog;
  }

  // Ported from blogController.js: createBlog. The legacy handler wrapped the
  // whole flow (db write + subscriber emails) in a catch that answered 401,
  // so any failure here keeps that exact shape.
  async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
    const { title, desc } = createBlogDto;

    try {
      // Add doc to db
      const blog = await this.blogRepository.save({
        title,
        desc,
        body: createBlogDto.body,
      });

      // Fetch subscribers' emails
      const subscribers = await this.subscribeRepository.find();
      const subscriberEmails = subscribers
        .map((sub) => sub.email)
        .filter((email): email is string => !!email);

      // Send email notification
      await this.mailService.sendBlogNotification(subscriberEmails, blog);

      return blog;
    } catch {
      throw new UnauthorizedException({ error: 'Unauthorized' });
    }
  }

  // Ported from blogController.js: deleteBlog.
  async deleteBlog(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException({ error: 'No such blog' });
    }

    await this.blogRepository.delete(id);

    return blog;
  }

  // Ported from blogController.js: updateBlog. findOneAndUpdate runs without
  // { new: true }, so the pre-update document is returned (legacy behavior).
  async updateBlog(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });

    if (!blog) {
      throw new NotFoundException({ error: 'No such blog' });
    }

    Object.assign(blog, updateBlogDto);
    return this.blogRepository.save(blog);
  }
}
