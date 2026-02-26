import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';
import { GetOneCategoryProvider } from './get-one-category.provider';

@Injectable()
export class DeleteCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly getOneCategoryProvider: GetOneCategoryProvider,
  ) {}
  public async deleteCategoty(id: string) {
    const category = await this.getOneCategoryProvider.findOneCategoryById(id);
    try {
      await this.categoryRepository.remove(category);
      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went wrong , please try later',
      );
    }
  }
}
