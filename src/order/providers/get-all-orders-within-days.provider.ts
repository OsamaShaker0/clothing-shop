import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders.entity';
import { Repository, MoreThan } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class GetAllOrdersWithinDaysProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  public async getAllOrdersWithinDays(days: number, status?: OrderStatus) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const whereCondition: any = {
      createdAt: MoreThan(date),
    };

    if (status) {
      whereCondition.status = status;
    }

    const orders = await this.orderRepository.find({
      where: whereCondition,
      order: {
        createdAt: 'DESC',
      },
    });

    return orders;
  }
}
