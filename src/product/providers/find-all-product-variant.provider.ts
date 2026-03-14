import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../productVariant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllProductVariantProvider {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}
  public async findAllProductVariant(productId) {
    try {
      const variants = await this.productVariantRepository.find({
        where: { productId: productId },
      });

      if (!variants || variants.length === 0) {
        throw new NotFoundException('this product has no variants');
      }
      return variants;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong ,please try again',
      );
    }
  }
}
