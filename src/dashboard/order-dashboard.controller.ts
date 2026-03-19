import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { OrderStatus } from 'src/order/enums/order-status.enum';
import { OrderService } from 'src/order/providers/order.service';

@ApiTags('Orders Dashboard')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AdminAccessOnlyGuard)
@Controller('orders-dashboard')
export class OrderDashboardController {
  constructor(private readonly orderService: OrderService) {}

  @Get('all-orders-within-days')
  @ApiOperation({ summary: 'Get all orders within specific days' })
  @ApiQuery({ name: 'days', type: 'number', example: 7 })
  @ApiQuery({
    name: 'status',
    enum: OrderStatus,
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  public async getAllOrdersWithinDays(
    @Query('days') days: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orderService.getAllOrdersWithinDays(days, status);
  }
  @Get('all-sells-within-days')
  @ApiOperation({ summary: 'Get total sales within specific days' })
  @ApiQuery({ name: 'days', type: 'number', example: 7 })
  @ApiQuery({
    name: 'status',
    enum: OrderStatus,
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Sales data retrieved' })
  public async getAllSellsNumbersWithinDays(
    @Query('days') days: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orderService.getSellsNumbersWithinDays(days, status);
  }
  @Post('order-status/:orderId')
  @ApiOperation({ summary: 'Update order delivery status' })
  @ApiParam({ name: 'orderId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  public async orderStatus(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() status: OrderStatus,
  ) {
    return this.orderService.changeOrderDeliveryStatus(orderId, status);
  }
  @Post('order-payed-status/:orderId')
  @ApiOperation({ summary: 'Mark order as paid' })
  @ApiParam({ name: 'orderId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Order marked as paid' })
  public async OrderPayedStatus(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ) {
    return this.orderService.changeOrderPayStatus(orderId);
  }
}
