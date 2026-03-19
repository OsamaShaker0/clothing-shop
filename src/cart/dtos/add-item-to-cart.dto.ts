import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({
    description: 'ID of the product to add to the cart',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;
  @ApiProperty({
    description: 'ID of the product variant to add to the cart',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @IsNotEmpty()
  @IsUUID()
  productVariant: string;
  @ApiPropertyOptional({
    description: 'Quantity of the product to add (optional, default 1)',
    minimum: 1,
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  quantity?: number = 1;
}
