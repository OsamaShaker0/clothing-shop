import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../coupon.entity';

@Injectable()
export class GetOneCouponProvider {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  public async getOneCouponWithId(id: string) {
    try {
      const coupon = await this.couponRepository.findOne({ where: { id } });
      if (!coupon) {
        throw new NotFoundException(`Coupon not found`);
      }
      return coupon;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
