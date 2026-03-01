import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';

@Injectable()
export class GetProductsProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  public async getAllProducts(findAllProductsDto: FindAllProductsDto) {
    try {
      const page = findAllProductsDto?.page ?? 1;
      const limit = findAllProductsDto?.limit ?? 10;
      const skip = (page - 1) * limit;
      const [products, total] = await this.productRepository.findAndCount({
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
