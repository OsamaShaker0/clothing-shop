import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Order } from '../orders.entity';
import { OrderItem } from '../order-item.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartItem } from 'src/cart/cart-item.entity';
import { ProductVariant } from 'src/product/productVariant.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { ActorType } from 'src/cart/enums/actor-type.enum';
import appConfig from 'src/config/app.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class OrderCheckoutProvider {
  constructor(
    private readonly dataSource: DataSource,

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  public async checkout(request: RequestWithActor, dto: CreateOrderDto) {
    const actorId = request.actor.sub;
    const actorType = request.actor.type;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //  get cart
      const cart = await queryRunner.manager.findOne(Cart, {
        where: [{ userId: actorId }, { guestId: actorId }],
        relations: ['items'],
      });

      if (!cart || cart.items.length === 0) {
        throw new NotFoundException('Cart not found or empty');
      }

      //  collect Variant IDs
      const variantIds = cart.items.map((item) => item.variantId);

      //  get all variants with lock
      const variants = await queryRunner.manager.find(ProductVariant, {
        where: { id: In(variantIds) },
        lock: { mode: 'pessimistic_write' },
      });

      const variantMap = new Map(
        variants.map((variant) => [variant.id, variant]),
      );

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
        orderPrice: 0,
        shippingPrice: this.config.shippingPrice ?? 100,
        totalPrice: 0,
      });

      await queryRunner.manager.save(order);

      let orderPrice = 0;
      const orderItems: OrderItem[] = [];

      // Process cart items
      for (const cartItem of cart.items) {
        const variant = variantMap.get(cartItem.variantId);

        if (!variant) {
          throw new NotFoundException(
            `Variant ${cartItem.variantId} not found`,
          );
        }

        if (variant.stock < cartItem.quantity) {
          throw new BadRequestException(
            `Product ${variant.id} is out of stock`,
          );
        }

        const price = variant.priceAfterDiscount ?? variant.price;

        const orderItem = queryRunner.manager.create(OrderItem, {
          order,
          productId: variant.productId,
          variantId: variant.id,
          variant,
          color: variant.color,
          size: variant.size,
          quantity: cartItem.quantity,
          price: variant.price,
          priceAfterDiscount: variant.priceAfterDiscount ?? null,
        });

        orderItems.push(orderItem);

        orderPrice += price * cartItem.quantity;

        // update stock
        variant.stock -= cartItem.quantity;
      }

      // Save order items
      await queryRunner.manager.save(OrderItem, orderItems);

      // Save updated variants with new stock
      await queryRunner.manager.save(ProductVariant, variants);

      //  Update order totals
      order.orderPrice = orderPrice;
      order.totalPrice = orderPrice + order.shippingPrice;

      await queryRunner.manager.save(order);

      // 9Clear cart
      await queryRunner.manager.delete(CartItem, { cartId: cart.id });

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
