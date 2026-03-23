import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsSpinnerProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getProductByLuck() {
    try {
      const productsCount = await this.productRepository.count();

      if (!productsCount) {
        throw new NotFoundException(`There is no products yet`);
      }

      const randomProductLength = Math.floor(Math.random() * productsCount);
      const [luckyProduct] = await this.productRepository.find({
        skip: randomProductLength,
        take: 1,
      });

      return luckyProduct;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong please try again',
      );
    }
  }
}
