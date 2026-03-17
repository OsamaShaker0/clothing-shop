import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '../orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChangeOrderPayStatusProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  public async changeOrderPay(orderId: string) {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      if (!order) {
        throw new NotFoundException(`There is no order  with id ${orderId}`);
      }
      if (order.payedStatus === true) {
        throw new BadRequestException(
          'payed orders cannot change payed status',
        );
      }
      order.payedStatus = true;
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
