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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({
    description: 'Array of image URLs for this variant (optional)',
    type: [String],
    example: [
      'https://example.com/variant1.jpg',
      'https://example.com/variant2.jpg',
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUrl({}, { each: true })
  imagesUrl: string[];
}
