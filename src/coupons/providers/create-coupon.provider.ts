import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '../coupon.entity';
import { Repository } from 'typeorm';
import { CreateCouponDto } from '../dtos/create-coupon.dto';

@Injectable()
export class CreateCouponProvider {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  public async createCoupon(createCouponDto: CreateCouponDto) {
    try {
      let coupon = await this.couponRepository.findOne({
        where: { code: createCouponDto.code },
      });
      if (coupon) {
        throw new BadRequestException('Coupon is already exist');
      }
      coupon = this.couponRepository.create({
        code: createCouponDto.code,
        percentage: createCouponDto.percentage,
      });
      coupon = await this.couponRepository.save(coupon);
      return coupon;
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
