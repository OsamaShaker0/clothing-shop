import { Injectable } from '@nestjs/common';
import { OrderCheckoutProvider } from './order-checkout.provider';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateOrderDto } from '../dtos/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderCheckOutProvider: OrderCheckoutProvider) {}

  public async makeOrderFromCart(
    request: RequestWithActor,
    createOrderDto: CreateOrderDto,
  ) {
    return this.orderCheckOutProvider.checkout(request, createOrderDto);
  }
}
