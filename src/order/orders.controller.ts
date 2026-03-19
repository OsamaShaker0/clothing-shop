import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './providers/order.service';
import type { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CreateOneItemOrderDto } from './dtos/create-one-item-order.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout cart and create an order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
  public async orderCheckOut(
    @Req() request: RequestWithActor,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.makeOrderFromCart(request, createOrderDto);
  }
  @Post('one-product-checkout')
  @ApiOperation({ summary: 'Checkout one product without cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-guest-id',
    required: false,
    description: 'Guest user UUID (optional if logged in)',
    schema: { type: 'string', format: 'uuid' },
  })
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
