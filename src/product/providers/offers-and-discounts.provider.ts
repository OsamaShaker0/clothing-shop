import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersAndDiscountsProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getAllOffers() {
    const offers = await this.productRepository
      .createQueryBuilder('product')
      .where('product.priceAfterDiscount < product.price')
      .orderBy('product.priceAfterDiscount', 'ASC')
      .getMany();

    return offers;
  }
}
