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
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get all categories (Public)' })
  @ApiQuery({ name: 'name', required: false, example: 'first one' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  public async getAllCategories(
    @Req() req: Request,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.categoryService.findAllCategories(req, paginationQueryDto);
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
