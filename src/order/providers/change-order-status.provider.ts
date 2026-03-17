import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class ChangeOrderStatusProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  public async changeOrderStatus(orderId: string, newOrderStatus: OrderStatus) {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      if (!order) {
        throw new NotFoundException(`There is no order  with id ${orderId}`);
      }
      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException('Delivered orders cannot change status');
      }
      order.status = newOrderStatus;
      await this.orderRepository.save(order);
      return order;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException || BadRequestException)
        throw error;
      throw new InternalServerErrorException(
        'Something went wrong , Please try later',
      );
    }
  }
}
