import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class GetSellsNumberWithinDaysProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  public async getSellsNumberWithinDays(days: number, status?: OrderStatus) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const query = this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'ordersCount')
      .addSelect('SUM(order.totalPrice)', 'totalOrdersPrice')
      .where('order.createdAt > :date', { date });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    const result = await query.getRawOne();

    return {
      ordersCount: Number(result.ordersCount) || 0,
      totalOrdersPrice: Number(result.totalOrdersPrice) || 0,
    };
  }
}
