import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { GetOneProductProvider } from './get-one-product.provider';
@Injectable()
export class DeleteProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly getOneProductProvider: GetOneProductProvider,
  ) {}
  public async deleteProductById(id: string) {
    const product = await this.getOneProductProvider.getOneProductById(id);
    try {
      await this.productRepository.remove(product);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went wrong , please try later',
        { description: String(error) },
      );
    }
  }
}
