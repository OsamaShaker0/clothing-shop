import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly dataSource: DataSource,

    @Inject(appConfig.KEY)
    private readonly Config: ConfigType<typeof appConfig>,
  ) {}

  public async checkout(
    request: RequestWithActor,
    createOrderDto: CreateOrderDto,
  ) {
    const actorId = request.actor.sub;
    const actorType = request.actor.type;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // get cart useing actor id
      const cart = await queryRunner.manager.findOne(Cart, {
        where: [{ userId: actorId }, { guestId: actorId }],
        relations: ['items'],
      });

      if (!cart || cart.items.length === 0) {
        throw new NotFoundException('Cart not found or empty');
      }

      let totalPrice = 0;

      // create order
      let order = this.orderRepository.create({
        firstName: createOrderDto.firstName,
        lastName: createOrderDto.lastName,
        userId: actorType === ActorType.NORMAL_USER ? actorId : undefined,
        guestId: actorType === ActorType.GUEST ? actorId : undefined,
        address: createOrderDto.address,
        phoneNumber: createOrderDto.phoneNumber,
        status: OrderStatus.PENDING,
        payment: createOrderDto.payment ?? PaymentMethod.CASH,
        orderPrice: 0,
        shippingPrice: this.Config.shippingPrice ?? 100, // set if you calculate shipping
        totalPrice: 0,
      });
      //save order
      await queryRunner.manager.save(order);

      // create order item using cart item and check for quentity with stock and variant existing
      for (const cartItem of cart.items) {
        const variant = await queryRunner.manager.findOne(ProductVariant, {
          where: { id: cartItem.variantId },
        });

        if (!variant) throw new NotFoundException('Product variant not found');

        if (variant.stock < cartItem.quantity) {
          throw new BadRequestException('Out of stock');
        }

        const orderItem = this.orderItemRepository.create({
          order,
          productId: variant.productId,
          variant: variant,
          variantId: variant.id,
          color: variant.color,
          size: variant.size,
          quantity: cartItem.quantity,
          price: variant.price,
        });

        await queryRunner.manager.save(orderItem);

        // update stock after create order
        variant.stock -= cartItem.quantity;
        await queryRunner.manager.save(variant);

        totalPrice += variant.price * cartItem.quantity;
      }

      // add shiping price + order price and get total price then save the new order price
      order.orderPrice = totalPrice + order.shippingPrice;

      await queryRunner.manager.save(order);

      // make cart empty
      await queryRunner.manager.delete(CartItem, { cartId: cart.id });

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
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
