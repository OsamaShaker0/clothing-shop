import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../coupon.entity';

@Injectable()
export class GetAllCouponsProvider {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  public async getAllCoupons() {
    try {
      const coupons = await this.couponRepository.find({});
      return coupons;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
