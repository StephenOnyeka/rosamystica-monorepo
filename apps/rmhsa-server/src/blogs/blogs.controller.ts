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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../admin/guards/admin-auth.guard';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blogs.dto';

// Ported from routes/blogs.js (mounted at /api/blogs).
@ApiTags('blogs')
@Controller('api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // GET /api/blogs?page=&limit=
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiOperation({ summary: 'List all blog posts with optional pagination' })
  @ApiResponse({ status: 200, description: 'Return all blog posts.' })
  getBlogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.blogsService.getBlogs(page, limit);
  }

  // GET /api/blogs/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a single blog post by ID' })
  @ApiResponse({ status: 200, description: 'Return the specified blog post.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  getBlog(@Param('id') id: string) {
    return this.blogsService.getBlog(id);
  }

  // POST /api/blogs. The legacy handler verified the JWT inline and answered
  // 401 { error: 'Unauthorized' } when it was missing/invalid, so the guard
  // reproduces that step before the body is validated.
  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new blog post (admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Delete a blog post (admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  deleteBlog(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }

  // PATCH /api/blogs/:id
  @Patch(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Update a blog post (admin only)' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  updateBlog(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }
}
