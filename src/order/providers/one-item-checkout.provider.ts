import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOneItemOrderDto } from '../dtos/create-one-item-order.dto';
import { ProductVariant } from 'src/product/productVariant.entity';
import { Order } from '../orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../order-item.entity';
import appConfig from 'src/config/app.config';
import type { ConfigType } from '@nestjs/config';
import { ActorType } from 'src/cart/enums/actor-type.enum';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

@Injectable()
export class OneItemCheckoutProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly dataSource: DataSource,

    @Inject(appConfig.KEY)
    private readonly Config: ConfigType<typeof appConfig>,
  ) {}

  public async oneItemCheckout(
    request: RequestWithActor,
    createOneTimeOrderDto: CreateOneItemOrderDto,
  ) {
    const actorId = request.actor.sub;
    const actorType = request.actor.type;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // find variant
      const variant = await queryRunner.manager.findOne(ProductVariant, {
        where: { id: createOneTimeOrderDto.productVariantId },
        lock: { mode: 'pessimistic_write' },
      });
      // check for stock
      if (!variant || variant.stock < createOneTimeOrderDto.quantity) {
        throw new NotFoundException(
          'Variant not found or not enough in stock ',
        );
      }

      // create order
      let order = this.orderRepository.create({
        firstName: createOneTimeOrderDto.firstName,
        lastName: createOneTimeOrderDto.lastName,
        userId: actorType === ActorType.NORMAL_USER ? actorId : undefined,
        guestId: actorType === ActorType.GUEST ? actorId : undefined,
        address: createOneTimeOrderDto.address,
        phoneNumber: createOneTimeOrderDto.phoneNumber,
        status: OrderStatus.PENDING,
        payment: createOneTimeOrderDto.payment ?? PaymentMethod.CASH,
        orderPrice: 0,
        shippingPrice: this.Config.shippingPrice ?? 100,
        totalPrice: 0,
      });
      await queryRunner.manager.save(order);
      // create order item
      const orderItem = this.orderItemRepository.create({
        order,
        productId: variant.productId,
        variant: variant,
        variantId: variant.id,
        color: variant.color,
        size: variant.size,
        quantity: createOneTimeOrderDto.quantity,
        price: variant.price,
      });
      await queryRunner.manager.save(orderItem);
      order.orderPrice = orderItem.price * orderItem.quantity;
      const totalPrice =
        orderItem.price * orderItem.quantity + order.shippingPrice;
      order.totalPrice = totalPrice;
      console.log(totalPrice);
      await queryRunner.manager.save(order);
      // update stock
      await queryRunner.manager.decrement(
        ProductVariant,
        { id: variant.id },
        'stock',
        orderItem.quantity,
      );

      await queryRunner.commitTransaction();
      // make order
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Checkout failed');
    } finally {
      await queryRunner.release();
    }
  }
}
