import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MinLength,
} from 'class-validator';
import { ProductVariantSize } from '../enums/product-variant-size.enum';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({
    description: 'Color of the product variant',
    minLength: 3,
    example: 'Red',
  })
  @IsNotEmpty()
  @MinLength(3)
  color: string;
  @ApiProperty({
    description: 'Size of the product variant',
    enum: ProductVariantSize,
    example: ProductVariantSize.M,
  })
  @IsNotEmpty()
  @IsEnum(ProductVariantSize)
  size: ProductVariantSize;
  @ApiProperty({
    description: 'Stock quantity of this variant',
    example: 50,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  stock: number;
}
