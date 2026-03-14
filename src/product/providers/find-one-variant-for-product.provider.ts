import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../productVariant.entity';
import { Repository } from 'typeorm';

import { FindOneVariantForProductDto } from '../dtos/find-one-variant-for-product.dto';

@Injectable()
export class FindOneVariantForProductProvider {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}
  public async findOneVariantForProduct(
    findOneVariantForProductDto: FindOneVariantForProductDto,
  ) {
    try {
      const variant = await this.productVariantRepository.findOne({
        where: {
          productId: findOneVariantForProductDto.productId,
          id: findOneVariantForProductDto.variantId,
        },
      });
      if (!variant) {
        throw new NotFoundException(
          `variant with id ${findOneVariantForProductDto.variantId} not found`,
        );
      }
      return variant;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
