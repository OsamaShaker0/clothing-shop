import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.SHIPPED,
    description: `
Order status values:

- pending → Order created but not processed yet
- confirmed → Order confirmed by system/admin
- shipped → Order shipped to customer
- delivered → Order delivered successfully
- cancelled → Order cancelled
- returned → Order returned after delivery
    `,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
