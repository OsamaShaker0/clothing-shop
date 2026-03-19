import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { DataSource } from 'typeorm';
import { CreateOneItemOrderDto } from '../dtos/create-one-item-order.dto';
import { ProductVariant } from 'src/product/productVariant.entity';
import { Order } from '../orders.entity';
import { OrderItem } from '../order-item.entity';
import appConfig from 'src/config/app.config';
import type { ConfigType } from '@nestjs/config';
import { ActorType } from 'src/cart/enums/actor-type.enum';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { Coupon } from 'src/coupons/coupon.entity';
import { CouponService } from 'src/coupons/providers/coupon.service';

@Injectable()
export class OneItemCheckoutProvider {
  constructor(
    private readonly dataSource: DataSource,

    private readonly couponService: CouponService,

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  public async oneItemCheckout(
    request: RequestWithActor,
    dto: CreateOneItemOrderDto,
  ) {
    const actorId = request.actor.sub;
    const actorType = request.actor.type;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // find variant with lock
      const variant = await queryRunner.manager.findOne(ProductVariant, {
        where: { id: dto.productVariantId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!variant) {
        throw new NotFoundException('Variant not found');
      }

      if (variant.stock < dto.quantity) {
        throw new BadRequestException('Not enough stock');
      }

      //  calculate price
      const unitPrice = variant.priceAfterDiscount ?? variant.price;
      const orderPrice = unitPrice * dto.quantity;
      const shippingPrice = this.config.shippingPrice ?? 100;
      const totalPrice = orderPrice + shippingPrice;

      //  create order
      const order = queryRunner.manager.create(Order, {
        firstName: dto.firstName,
        lastName: dto.lastName,
        userId: actorType === ActorType.NORMAL_USER ? actorId : undefined,
        guestId: actorType === ActorType.GUEST ? actorId : undefined,
        address: dto.address,
        phoneNumber: dto.phoneNumber,
        status: OrderStatus.PENDING,
        payment: dto.payment ?? PaymentMethod.CASH,
        orderPrice,
        shippingPrice,
        totalPrice,
      });
      // apply coupon
      if (dto.discountCoupon) {
        const coupon = await queryRunner.manager.findOne(Coupon, {
          where: { code: dto.discountCoupon, isActive: true },
        });
        if (!coupon)
          throw new NotFoundException('Coupon not found or inactive');

        await this.couponService.applyCoupon(
          coupon,
          order,
          queryRunner.manager,
        );
      }
      await queryRunner.manager.save(order);

      //  create order item
      const orderItem = queryRunner.manager.create(OrderItem, {
        order,
        productId: variant.productId,
        variantId: variant.id,
        variant,
        color: variant.color,
        size: variant.size,
        quantity: dto.quantity,
        price: variant.price,
        priceAfterDiscount: variant.priceAfterDiscount ?? null,
      });

      await queryRunner.manager.save(orderItem);

      //  update stock
      variant.stock -= dto.quantity;
      variant.sellsVariantCount = variant.sellsVariantCount + dto.quantity;
      await queryRunner.manager.save(variant);

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('Checkout failed');
    } finally {
      await queryRunner.release();
    }
  }
}
