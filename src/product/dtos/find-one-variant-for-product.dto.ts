import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneVariantForProductDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;
  @IsNotEmpty()
  @IsUUID()
  variantId: string;
}
