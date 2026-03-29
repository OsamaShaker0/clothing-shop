import { Injectable } from '@nestjs/common';
import { CreateCategoryProvider } from './create-category.provider';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { Category } from '../categories.entity';
import { FindCategoryDto } from '../dtos/find-all-query.dto';
import { EditCategoryDto } from '../dtos/edit-category.dto';
import { GetCategoriesProvider } from './get-categories.provider';
import { GetOneCategoryProvider } from './get-one-category.provider';
import { UpdateCategoryProvider } from './update-category.provider';
import { DeleteCategoryProvider } from './delete-category.provider';

import { Request } from 'express';
import { GetNonActiveCategoriesProvider } from './get-non-active-categories.provider';

@Injectable()
export class CategoryService {
  constructor(
    private readonly getCategoriesProvider: GetCategoriesProvider,
    private readonly getNonActiveCategoriesProvider: GetNonActiveCategoriesProvider,
    private readonly createCategoryProvider: CreateCategoryProvider,
    private readonly getOneCategoryProvider: GetOneCategoryProvider,
    private readonly updateCategoryProvider: UpdateCategoryProvider,
    private readonly deleteCategoryProvider: DeleteCategoryProvider,
  ) {}
  public async createCatgeory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    return this.createCategoryProvider.createCategory(createCategoryDto, file);
  }
  public async findAllCategories(
    findCategoryDto: FindCategoryDto,
    req: Request,
  ) {
    return this.getCategoriesProvider.findAllCategories(findCategoryDto, req);
  }
  public async findOneCategoryById(id: string): Promise<Category> {
    return await this.getOneCategoryProvider.findOneCategoryById(id);
  }
  public async findNonActiveCategories() {
    return await this.getNonActiveCategoriesProvider.getNonActiveCategories();
  }
  public async editCategory(id: string, editCategoryDto: EditCategoryDto) {
    return this.updateCategoryProvider.updateCategory(id, editCategoryDto);
  }
  public async deleteCategory(id: string) {
    return this.deleteCategoryProvider.deleteCategoty(id);
  }
}
