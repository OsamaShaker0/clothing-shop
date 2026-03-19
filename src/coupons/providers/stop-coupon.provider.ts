import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '../coupon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StopCouponProvider {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  public async updateCouponActive(id: string, isActive: boolean) {
    try {
      let coupon = await this.couponRepository.update({ id }, { isActive });
      if (!coupon) {
        throw new NotFoundException('Coupon does not exist');
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
