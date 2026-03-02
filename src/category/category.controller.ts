import {
  Body,
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './providers/category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FindCategoryDto } from './dtos/find-all-query.dto';
import { EditCategoryDto } from './dtos/edit-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}
  @Post() // only admin can access
  @UseInterceptors(FileInterceptor('image',{    storage: memoryStorage(),}))
  public async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.createCatgeory(createCategoryDto, file);
  }
  @Get()
  public async getAllCategories(@Query() findCategoryDto: FindCategoryDto) {
    return this.categoryService.findAllCategories(findCategoryDto);
  }
  @Get(':id')
  public async findCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.findOneCategoryById(id);
  }
  @Patch(':id') // only admin can access
  public async PatchCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() editCaregoryDto: EditCategoryDto,
  ) {
    return this.categoryService.editCategory(id, editCaregoryDto);
  }

  @Delete(':id') // only admin can access
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
