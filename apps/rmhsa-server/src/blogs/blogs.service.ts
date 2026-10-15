import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto, UpdateBlogDto } from './dto/blogs.dto';
import { Blog } from './entities/blog.entity';
import { NotificationsService } from '../notifications/notifications.service';

export interface PaginatedBlogs {
  blogs: Blog[];
  totalPosts: number;
  totalPages: number;
}

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly notificationsService: NotificationsService,
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
    const { title, desc, image, coverImage, backgroundImage } = createBlogDto;

    const imgVal = backgroundImage || coverImage || image || undefined;

    try {
      // Add doc to db
      const blog = await this.blogRepository.save({
        title: title || '',
        desc,
        body: createBlogDto.body,
        image: imgVal,
        coverImage: imgVal,
        backgroundImage: imgVal,
      });

      // Publishing a blog adds it to the notifications and sends the single
      // subscriber email. Failures here must not undo the published blog.
      try {
        await this.notificationsService.createFromBlog(blog);
      } catch (error) {
        this.logger.error(
          `Failed to create notification for blog ${blog.id}: ${String(error)}`,
        );
      }

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

    // Delete any notifications associated with this blog
    try {
      await this.notificationsService.deleteByBlogId(id, blog.title);
    } catch (error) {
      this.logger.error(
        `Failed to delete notification for blog ${id}: ${String(error)}`,
      );
    }

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
    const updated = await this.blogRepository.save(blog);

    // Keep associated notification in sync
    try {
      await this.notificationsService.updateByBlog(updated);
    } catch (error) {
      this.logger.error(
        `Failed to update notification for blog ${id}: ${String(error)}`,
      );
    }

    return updated;
  }
}
