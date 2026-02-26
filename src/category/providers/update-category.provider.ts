import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';
import { EditCategoryDto } from '../dtos/edit-category.dto';
import { GetOneCategoryProvider } from './get-one-category.provider';

@Injectable()
export class UpdateCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly getOneCategoryProvider: GetOneCategoryProvider,
  ) {}

  public async updateCategory(id: string, editCategoryDto: EditCategoryDto) {
    try {
      let category = await this.getOneCategoryProvider.findOneCategoryById(id);
      this.categoryRepository.merge(category, editCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong, try again',
        {
          description: String(error),
        },
      );
    }
  }
}
