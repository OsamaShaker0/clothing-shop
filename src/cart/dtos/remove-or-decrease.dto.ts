import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveOrDecreaseItemDto {
  @ApiProperty({
    description: 'ID of the cart item to remove or decrease',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  cartItemId: string;
}
