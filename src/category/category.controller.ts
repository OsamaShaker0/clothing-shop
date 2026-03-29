import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './providers/category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

import { EditCategoryDto } from './dtos/edit-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Public } from 'src/auth/decorators/public.decorator';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { PaginationQueryDto } from 'src/utils/pagination/dto/pagination-query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { FindCategoryDto } from './dtos/find-all-query.dto';
import { Category } from './categories.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @UseGuards(AdminAccessOnlyGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image', 'name', 'slug', 'description'],
      properties: {
        name: { type: 'string', example: 'Summer Collection' },
        slug: { type: 'string', example: 'summer-collection' },
        description: { type: 'string', example: 'Category description' },
        image: { type: 'string', format: 'binary' }, // must match interceptor
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  public async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.createCatgeory(createCategoryDto, file);
  }
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all categories (with pagination & search)' })
  @ApiResponse({
    status: 200,
    description: 'List of categories with pagination',
  })
  public async getAllCategories(
    @Req() req: Request,
    @Query() findCategoryDto: FindCategoryDto,
  ) {
    return this.categoryService.findAllCategories(findCategoryDto, req);
  }
  @Get('non-active')
  @UseGuards(AdminAccessOnlyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all non-active categories (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of non-active categories',
    type: [Category],
  })
  public async getNonActive() {
    return this.categoryService.findNonActiveCategories();
  }
  @Get(':categoryId')
  @Public()
  @ApiOperation({ summary: 'Get category by ID (Public)' })
  @ApiParam({
    name: 'categoryId',
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Category found' })
  public async findCategoryById(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ) {
    return this.categoryService.findOneCategoryById(categoryId);
  }
  @Patch(':categoryId')
  @UseGuards(AdminAccessOnlyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit a category (Admin only)' })
  @ApiParam({
    name: 'categoryId',
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  public async PatchCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() editCaregoryDto: EditCategoryDto,
  ) {
    return this.categoryService.editCategory(categoryId, editCaregoryDto);
  }

  @Delete(':categoryId')
  @UseGuards(AdminAccessOnlyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (Admin only)' })
  @ApiParam({
    name: 'categoryId',
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  public async deleteCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
