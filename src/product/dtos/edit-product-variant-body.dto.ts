import { IsEnum, IsInt, IsOptional, MinLength } from 'class-validator';
import { ProductVariantSize } from '../enums/product-variant-size.enum';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EditProductVariantBodyDto {
  @ApiPropertyOptional({
    description: 'Color of the product variant (optional)',
    minLength: 3,
    example: 'Blue',
  })
  @IsOptional()
  @MinLength(3)
  color?: string;
  @ApiPropertyOptional({
    description: 'Size of the product variant (optional)',
    enum: ProductVariantSize,
    example: ProductVariantSize.L,
  })
  @IsOptional()
  @IsEnum(ProductVariantSize)
  size?: ProductVariantSize;
  @ApiPropertyOptional({
    description: 'Stock quantity of this variant (optional)',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stock?: number;
}
