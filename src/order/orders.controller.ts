import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './providers/order.service';
import type { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CreateOneItemOrderDto } from './dtos/create-one-item-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  public async orderCheckOut(
    @Req() request: RequestWithActor,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.makeOrderFromCart(request, createOrderDto);
  }
  @Post('one-product-checkout')
  public async orderCheckOutForOneProduct(
    @Req() request: RequestWithActor,
    @Body() createOneItemOrderDto: CreateOneItemOrderDto,
  ) {
    return this.orderService.makeOrderWithOneProduct(
      request,
      createOneItemOrderDto,
    );
  }
}
