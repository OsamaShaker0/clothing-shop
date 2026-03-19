import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../productVariant.entity';
import { MoreThan, Repository } from 'typeorm';
import appConfig from 'src/config/app.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class BestSellerProvider {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly ProductVariantRepository: Repository<ProductVariant>,

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  public async getBestSellerVariants() {
    try {
      const bestSellerVariants = await this.ProductVariantRepository.find({
        where: { stock: MoreThan(1) },
        order: { sellsVariantCount: 'DESC' },
        take: this.config.bestSellerNumber,
      });
      return bestSellerVariants;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
