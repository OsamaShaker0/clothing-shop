import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteProductVariantDto } from '../dtos/delete-product-variant.dto';
import { ProductVariant } from '../productVariant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteVariantForProductProvider {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {}

  public async deleteProductVariantById(
    deleteProductVariantDto: DeleteProductVariantDto,
  ) {
    try {
      const result = await this.productVariantRepository.delete({
        id: deleteProductVariantDto.variantId,
        productId: deleteProductVariantDto.productId,
      });
      if (!result.affected) {
        throw new NotFoundException(
          `Variant with id ${deleteProductVariantDto.variantId} not found`,
        );
      }
      return { message: 'variant deleted successfully' };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
