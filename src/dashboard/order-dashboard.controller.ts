import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { OrderStatus } from 'src/order/enums/order-status.enum';
import { OrderService } from 'src/order/providers/order.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AdminAccessOnlyGuard)
@Controller('orders-dashboard')
export class OrderDashboardController {
  constructor(private readonly orderService: OrderService) {}
  @Get('all-orders-within-days')
  public async getAllOrdersWithinDays(days: number, status?: OrderStatus) {
    return this.orderService.getAllOrdersWithinDays(days, status);
  }
  @Get('all-sells-within-days')
  public async getAllSellsNumbersWithinDays(
    days: number,
    status?: OrderStatus,
  ) {
    return this.orderService.getSellsNumbersWithinDays(days, status);
  }
  @Post('order-status/:orderId')
  public async orderStatus(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() status: OrderStatus,
  ) {
    return this.orderService.changeOrderDeliveryStatus(orderId, status);
  }
  @Post('order-payed-status/:orderId')
  public async OrderPayedStatus(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ) {
    return this.orderService.changeOrderPayStatus(orderId);
  }
}
