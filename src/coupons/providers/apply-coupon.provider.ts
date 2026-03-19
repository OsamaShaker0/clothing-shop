///
import { BadRequestException, Injectable } from '@nestjs/common';
import { Coupon } from '../coupon.entity';
import { Order } from 'src/order/orders.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ApplyCouponProvider {
  public async applyCoupon(
    coupon: Coupon,
    order: Order,
    manager: EntityManager, //  shared transaction
  ) {
    if (order.priceAfterApplyCoupon) {
      throw new BadRequestException('Coupon already applied');
    }

    const discountAmount = (order.orderPrice * coupon.percentage) / 100;

    const finalOrderPrice = order.orderPrice - discountAmount;

    order.discountAmount = discountAmount;
    order.discountCouponPercentage = coupon.percentage;
    order.priceAfterApplyCoupon = finalOrderPrice;

    order.totalPrice = finalOrderPrice + order.shippingPrice;

    await manager.save(order);

    coupon.numberOfUse += 1;
    coupon.amountOfOrdersDiscount += discountAmount;
    await manager.save(coupon);

    return order;
  }
}
