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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateCategoryDto } from 'src/category/dtos/create-category.dto';
import { EditCategoryDto } from 'src/category/dtos/edit-category.dto';
import { CategoryService } from 'src/category/providers/category.service';

@ApiTags('Categories Dashboard')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AdminAccessOnlyGuard)
@Controller('categories-dashboard')
export class CategoryDashboardController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  public async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.createCatgeory(createCategoryDto, file);
  }
  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'categoryId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  public async PatchCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() editCaregoryDto: EditCategoryDto,
  ) {
    return this.categoryService.editCategory(categoryId, editCaregoryDto);
  }
  @Delete(':categoryId')
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'categoryId', type: 'string' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
