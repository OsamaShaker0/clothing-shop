import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product.entity';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { GetOneProductProvider } from './get-one-product.provider';

@Injectable()
export class UpdateProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly getOneProductProvider: GetOneProductProvider,
  ) {}
  public async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    let product = await this.getOneProductProvider.getOneProductById(id);
    try {
      this.productRepository.merge(product, updateProductDto);
      return await this.productRepository.save(product);
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
