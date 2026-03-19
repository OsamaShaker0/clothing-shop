import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { MoreThan, Repository } from 'typeorm';
import appConfig from 'src/config/app.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class NewArrivalsProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}
  public async newArrivals() {
    try {
      const date = new Date();
      date.setDate(date.getDate() - this.config.newArrivalsDays);

      const newArrivalsProducts = await this.productRepository.find({
        where: { createdAt: MoreThan(date) },
        order: { createdAt: 'DESC' },
        take: this.config.newArrivalsLimit,
      });
      return newArrivalsProducts;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Somethimg went wrong , please try again',
      );
    }
  }
}
