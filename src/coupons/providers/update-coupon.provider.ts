import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '../coupon.entity';
import { Repository } from 'typeorm';
import { UpdateCouponPercentageDto } from '../dtos/update-coupon-percentage.dto';

@Injectable()
export class UpdateCouponProvider {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  public async updateCouponPercentage(
    id: string,
    updateCouponPercentage: UpdateCouponPercentageDto,
  ) {
    try {
      let coupon = await this.couponRepository.update(
        { id },
        { percentage: updateCouponPercentage.percentage },
      );
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
