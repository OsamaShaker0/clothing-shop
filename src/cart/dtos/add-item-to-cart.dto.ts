import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';

export class AddItemToCartDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;
  @IsNotEmpty()
  @IsUUID()
  productVariant: string;
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  quantity?: number;
}
