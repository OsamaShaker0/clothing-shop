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

export class CreateVariantDto {
  @IsNotEmpty()
  @MinLength(3)
  color: string;
  @IsNotEmpty()
  @IsEnum(ProductVariantSize)
  size: ProductVariantSize;
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  stock: number;
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imagesUrl?: string[];
}
