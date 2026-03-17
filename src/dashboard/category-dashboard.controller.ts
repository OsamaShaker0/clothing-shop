import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateCategoryDto } from 'src/category/dtos/create-category.dto';
import { EditCategoryDto } from 'src/category/dtos/edit-category.dto';
import { CategoryService } from 'src/category/providers/category.service';
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AdminAccessOnlyGuard)
@Controller('categories-dashboard')
export class CategoryDashboardController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  public async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.createCatgeory(createCategoryDto, file);
  }
  @Patch(':categoryId')
  @UseGuards(AdminAccessOnlyGuard)
  public async PatchCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() editCaregoryDto: EditCategoryDto,
  ) {
    return this.categoryService.editCategory(categoryId, editCaregoryDto);
  }
  @Delete(':categoryId')
  @UseGuards(AdminAccessOnlyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
