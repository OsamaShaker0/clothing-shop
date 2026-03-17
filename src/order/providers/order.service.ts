import { Injectable } from '@nestjs/common';
import { OrderCheckoutProvider } from './order-checkout.provider';
import { RequestWithActor } from 'src/cart/interfaces/request-actor.inteface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOneItemOrderDto } from '../dtos/create-one-item-order.dto';
import { OneItemCheckoutProvider } from './one-item-checkout.provider';
import { ChangeOrderPayStatusProvider } from './change-order-pay-status.provider';
import { OrderStatus } from '../enums/order-status.enum';
import { ChangeOrderStatusProvider } from './change-order-status.provider';
import { GetAllOrdersWithinDaysProvider } from './get-all-orders-within-days.provider';
import { GetSellsNumberWithinDaysProvider } from './get-sells-number-within-days.provider';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderCheckOutProvider: OrderCheckoutProvider,

    private readonly OneItemCheckoutProvider: OneItemCheckoutProvider,

    private readonly changeOrderPayStatusProvider: ChangeOrderPayStatusProvider,

    private readonly changeOrderStatusProvider: ChangeOrderStatusProvider,

    private readonly getAllOrdersWithinDaysProvider: GetAllOrdersWithinDaysProvider,

    private readonly getSellsNumberWithinDaysProvider: GetSellsNumberWithinDaysProvider,
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
  public async changeOrderPayStatus(orderId: string) {
    return this.changeOrderPayStatusProvider.changeOrderPay(orderId);
  }
  public async changeOrderDeliveryStatus(orderId: string, status: OrderStatus) {
    return this.changeOrderStatusProvider.changeOrderStatus(orderId, status);
  }
  public async getAllOrdersWithinDays(days: number, status?: OrderStatus) {
    return this.getAllOrdersWithinDaysProvider.getAllOrdersWithinDays(
      days,
      status,
    );
  }
  public async getSellsNumbersWithinDays(days: number, status?: OrderStatus) {
    return this.getSellsNumberWithinDaysProvider.getSellsNumberWithinDays(
      days,
      status,
    );
  }
}
