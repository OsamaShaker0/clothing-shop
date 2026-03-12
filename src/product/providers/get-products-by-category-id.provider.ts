import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { GetProductsByCategoryIdDto } from '../dtos/get-products-by-category-id.dto';

import { CategoryService } from 'src/category/providers/category.service';

@Injectable()
export class GetProductsByCategoryIdProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly categoryService: CategoryService,
  ) {}

  public async getProductsByCategory(
    categoryId: string,
    GetProductsByCategoryIdDto: GetProductsByCategoryIdDto,
  ) {
    const category = await this.categoryService.findOneCategoryById(categoryId);
    const page = GetProductsByCategoryIdDto?.page ?? 1;
    const limit = GetProductsByCategoryIdDto?.limit ?? 10;
    const skip = (page - 1) * limit;
    const [products, total] = await this.productRepository.findAndCount({
      where: { category: { id: category.id } },
      skip,
      take: limit,
      order: { name: 'ASC' },
    });
    return {
      page,
      limit,
      total,
      products,
    };
  }
  catch(error) {
    console.error(error);
    throw new InternalServerErrorException('Something went wrong, try again', {
      description: String(error),
    });
  }
}
