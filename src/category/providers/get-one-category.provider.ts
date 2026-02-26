import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetOneCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  public async findOneCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOneBy({ id });
      if (!category) {
        throw new NotFoundException('category not found ');
      }
      return category;
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error; // rethrow the same error
      }

      // For any other unexpected error
      throw new InternalServerErrorException('Something went wrong', {
        description: String(error),
      });
    }
  }
}
