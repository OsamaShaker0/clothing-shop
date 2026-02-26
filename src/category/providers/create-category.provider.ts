import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      let category = this.categoryRepository.create(createCategoryDto);
      category = await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Slug already exists');
      }

      throw new InternalServerErrorException(
        'Cannot create category, please try again later',
        { description: error },
      );
    }
  }
}
