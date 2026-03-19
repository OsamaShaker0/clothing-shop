import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '../coupon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteCouponProvider {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  public async deleteCoupon(id: string) {
    try {
      let coupon = await this.couponRepository.findOne({
        where: { id },
      });
      if (!coupon) {
        throw new NotFoundException('Coupon does not exist');
      }
      await this.couponRepository.delete(id);
      return { message: 'Coupon deleted successfully' };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Something went wrong , please try again',
      );
    }
  }
}
