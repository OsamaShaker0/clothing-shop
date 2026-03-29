import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';
import e from 'express';
@Injectable()
export class GetNonActiveCategoriesProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async getNonActiveCategories() {
    try {
      const nonActive = await this.categoryRepository.find({
        where: { isActive: false },
      });
      if (nonActive.length == 0)
        return { message: 'there are no non active categories' };
      return nonActive;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrnong please try again',
      );
    }
  }
}
