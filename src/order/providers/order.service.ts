import { Injectable } from '@nestjs/common';
import { OrderCheckoutProvider } from './order-checkout.provider';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOneItemOrderDto } from '../dtos/create-one-item-order.dto';
import { OneItemCheckoutProvider } from './one-item-checkout.provider';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderCheckOutProvider: OrderCheckoutProvider,

    private readonly OneItemCheckoutProvider: OneItemCheckoutProvider,
  ) {}

  public async makeOrderFromCart(
    request: RequestWithActor,
    createOrderDto: CreateOrderDto,
  ) {
    return this.orderCheckOutProvider.checkout(request, createOrderDto);
  }
  public async makeOrderWithOneProduct(
    request: RequestWithActor,
    createOneTimeOrderDto: CreateOneItemOrderDto,
  ) {
    return this.OneItemCheckoutProvider.oneItemCheckout(
      request,
      createOneTimeOrderDto,
    );
  }
}
