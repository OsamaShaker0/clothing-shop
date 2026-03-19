///

import {
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../product.entity';
import { ProductVariant } from '../productVariant.entity';

@Injectable()
export class DiscountProvider {
  constructor(private readonly dataSource: DataSource) {}

  async addDiscountForProductAndVariants(
    productId: string,
    discountPercentage: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      await queryRunner.manager.update(
        Product,
        { id: productId },
        {
          priceAfterDiscount: product.price * (1 - discountPercentage / 100),
        },
      );

      // update all variants of this product
      await queryRunner.manager
        .createQueryBuilder()
        .update(ProductVariant)
        .set({
          priceAfterDiscount: () => `price * (1 - ${discountPercentage} / 100)`,
        })
        .where('productId = :productId', { productId })
        .execute();

      await queryRunner.commitTransaction();

      return { message: 'Discount applied successfully' };
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        `Something went wrong please try again`,
      );
    } finally {
      await queryRunner.release();
    }
  }
  async removeDiscountFromProductAndVariants(productId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      await queryRunner.manager.update(
        Product,
        { id: productId },
        {
          priceAfterDiscount: undefined,
        },
      );

      // remove discount from all variants
      await queryRunner.manager.update(
        ProductVariant,
        { productId: productId },
        {
          priceAfterDiscount: undefined,
        },
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Discount removed successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
