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
@UseInterceptors(ClassSerializerInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @UseGuards(AdminAccessOnlyGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  public async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.createCatgeory(createCategoryDto, file);
  }
  @Get()
  @Public()
  public async getAllCategories(
    @Req() req: Request,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.categoryService.findAllCategories(req, paginationQueryDto);
  }
  @Get(':id')
  @Public()
  public async findCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.findOneCategoryById(id);
  }
  @Patch(':id')
  @UseGuards(AdminAccessOnlyGuard)
  public async PatchCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() editCaregoryDto: EditCategoryDto,
  ) {
    return this.categoryService.editCategory(id, editCaregoryDto);
  }

  @Delete(':id')
  @UseGuards(AdminAccessOnlyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
