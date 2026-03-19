import { Module } from '@nestjs/common';
import { CouponService } from './providers/coupon.service';
import { CreateCouponProvider } from './providers/create-coupon.provider';
import { UpdateCouponProvider } from './providers/update-coupon.provider';
import { DeleteCouponProvider } from './providers/delete-coupon.provider';
import { StopCouponProvider } from './providers/stop-coupon.provider';
import { GetAllCouponsProvider } from './providers/get-all-coupons.provider';
import { GetOneCouponProvider } from './providers/get-one-coupon.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './coupon.entity';
import { ApplyCouponProvider } from './providers/apply-coupon.provider';

@Module({
  providers: [
    CouponService,
    CreateCouponProvider,
    UpdateCouponProvider,
    DeleteCouponProvider,
    StopCouponProvider,
    GetAllCouponsProvider,
    GetOneCouponProvider,
    ApplyCouponProvider,
  ],
  imports: [TypeOrmModule.forFeature([Coupon])],
  exports: [CouponService],
})
export class CouponsModule {}
