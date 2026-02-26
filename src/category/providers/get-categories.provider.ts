import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';
import { FindCategoryDto } from '../dtos/find-all-query.dto';

@Injectable()
export class GetCategoriesProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  public async findAllCategories(findCategoryDto: FindCategoryDto) {
  try {
    const page = findCategoryDto.page ?? 1;
    const limit = findCategoryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const [categories, total] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      page,
      limit,
      total,
      categories,
    };
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Something went wrong, try again', {
      description: String(error),
    });
  }
}
}

