import { Injectable } from '@nestjs/common';
import { CreateCouponProvider } from './create-coupon.provider';
import { UpdateCouponPercentageDto } from '../dtos/update-coupon-percentage.dto';
import { UpdateCouponProvider } from './update-coupon.provider';
import { StopCouponProvider } from './stop-coupon.provider';
import { DeleteCouponProvider } from './delete-coupon.provider';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { GetAllCouponsProvider } from './get-all-coupons.provider';
import { GetOneCouponProvider } from './get-one-coupon.provider';
import { ApplyCouponProvider } from './apply-coupon.provider';
import { Coupon } from '../coupon.entity';
import { Order } from 'src/order/orders.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class CouponService {
  constructor(
    private readonly createCouponProvider: CreateCouponProvider,

    private readonly updateCouponPercentageProvider: UpdateCouponProvider,

    private readonly stopCouponProvider: StopCouponProvider,

    private readonly deleteCouponProvider: DeleteCouponProvider,

    private readonly getAllCouponsProvider: GetAllCouponsProvider,

    private readonly getOneCouponProvider: GetOneCouponProvider,

    private readonly applyCouponProvider: ApplyCouponProvider,
  ) {}
  public async getAllCoupons() {
    return this.getAllCouponsProvider.getAllCoupons();
  }
  public async getOneCouponWithId(id: string) {
    return this.getOneCouponProvider.getOneCouponWithId(id);
  }
  public async createCoupon(createCouponDto: CreateCouponDto) {
    return this.createCouponProvider.createCoupon(createCouponDto);
  }
  public async updateCouponPercentage(
    id: string,
    updateCouponPercentageDto: UpdateCouponPercentageDto,
  ) {
    return this.updateCouponPercentageProvider.updateCouponPercentage(
      id,
      updateCouponPercentageDto,
    );
  }
  public async updateCouponValidation(id: string, isActice: boolean) {
    return this.stopCouponProvider.updateCouponActive(id, isActice);
  }
  public async deleteCoupon(id: string) {
    return await this.deleteCouponProvider.deleteCoupon(id);
  }
  public async applyCoupon(
    coupon: Coupon,
    order: Order,
    manager: EntityManager,
  ) {
    return this.applyCouponProvider.applyCoupon(coupon, order, manager);
  }
}
