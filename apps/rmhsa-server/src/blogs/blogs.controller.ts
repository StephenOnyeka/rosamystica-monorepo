import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../admin/guards/admin-auth.guard';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blogs.dto';

// Ported from routes/blogs.js (mounted at /api/blogs).
@Controller('api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // GET /api/blogs?page=&limit=
  @Get()
  getBlogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.blogsService.getBlogs(page, limit);
  }

  // GET /api/blogs/:id
  @Get(':id')
  getBlog(@Param('id') id: string) {
    return this.blogsService.getBlog(id);
  }

  // POST /api/blogs. The legacy handler verified the JWT inline and answered
  // 401 { error: 'Unauthorized' } when it was missing/invalid, so the guard
  // reproduces that step before the body is validated.
  @Post()
  @UseGuards(AdminAuthGuard)
  @HttpCode(200)
  createBlog(@Body() createBlogDto: CreateBlogDto) {
    const emptyFields: string[] = [];

    if (!createBlogDto.title) {
      emptyFields.push('title');
    }
    if (!createBlogDto.desc) {
      emptyFields.push('desc');
    }
    if (!createBlogDto.body) {
      emptyFields.push('body');
    }

    if (emptyFields.length > 0) {
      throw new BadRequestException({
        error: 'Please fill in all the fields',
        emptyFields,
      });
    }

    return this.blogsService.createBlog(createBlogDto);
  }

  // DELETE /api/blogs/:id
  @Delete(':id')
  deleteBlog(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }

  // PATCH /api/blogs/:id
  @Patch(':id')
  updateBlog(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }
}
