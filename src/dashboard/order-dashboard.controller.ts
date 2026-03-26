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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { UpdateOrderStatusDto } from 'src/order/dtos/update-order-status.dto';
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
  @ApiOperation({
    summary: 'Update order status',
    description: `
Update the lifecycle status of an order.

Allowed flow (recommended):
PENDING → CONFIRMED → SHIPPED → DELIVERED

Other cases:
- CANCELLED: Can happen before shipping
- RETURNED: Only after delivery
  `,
  })
  @ApiParam({
    name: 'orderId',
    type: 'string',
    description: 'Unique UUID of the order',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'New status to assign to the order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    schema: {
      example: {
        message: 'Order status updated',
        status: 'shipped',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition or bad request',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  public async orderStatus(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.changeOrderDeliveryStatus(
      orderId,
      updateOrderStatusDto.status,
    );
  }
  @Post('order-payed-status/:orderId')
  @ApiOperation({
    summary: 'Mark order as paid',
    description: `
Marks the specified order as paid. 

Use this endpoint after payment is successfully processed.

Validations:
- Order must exist
- Order should not already be marked as paid
  `,
  })
  @ApiParam({
    name: 'orderId',
    type: 'string',
    description: 'UUID of the order to mark as paid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Order marked as paid successfully',
    schema: {
      example: {
        message: 'Order payment status updated',
        orderId: '550e8400-e29b-41d4-a716-446655440000',
        paid: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Order is already paid or bad request',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  public async OrderPayedStatus(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ) {
    return this.orderService.changeOrderPayStatus(orderId);
  }
}
