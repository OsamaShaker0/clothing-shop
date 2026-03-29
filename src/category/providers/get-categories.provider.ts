import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories.entity';
import { Repository } from 'typeorm';
import { FindCategoryDto } from '../dtos/find-all-query.dto';
import { ILike } from 'typeorm';
import { Request } from 'express';
@Injectable()
export class GetCategoriesProvider {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async findAllCategories(
    findCategoryDto: FindCategoryDto,
    req: Request,
  ) {
    try {
      const { name, page = 1, limit = 10 } = findCategoryDto;

      const skip = (page - 1) * limit;

      const where: any = {
        isActive: true,
      };

      if (name) {
        where.name = ILike(`%${name}%`);
      }

      const [categories, total] = await this.categoryRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { name: 'ASC' },
      });

      const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;

      const buildUrl = (pageNumber: number) => {
        const query = new URLSearchParams({
          page: String(pageNumber),
          limit: String(limit),
          ...(name && { name }),
        });

        return `${baseUrl}?${query.toString()}`;
      };

      const next = page * limit < total ? buildUrl(page + 1) : null;

      const previous = page > 1 ? buildUrl(page - 1) : null;

      return { categories, page, limit, total, next, previous };
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
