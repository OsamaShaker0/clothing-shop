import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
@Injectable()
export class GetOneProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getOneProductById(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`product with id of ${id} is not found`);
      }
      return product;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Something went wrong', {
        description: String(error),
      });
    }
  }
}
