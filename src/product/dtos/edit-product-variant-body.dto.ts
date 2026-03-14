import {
  IsEnum,
  IsInt,

  IsOptional,
  MinLength,
} from 'class-validator';
import { ProductVariantSize } from '../enums/product-variant-size.enum';
import { Type } from 'class-transformer';

export class EditProductVariantBodyDto {
  @IsOptional()
  @MinLength(3)
  color?: string;
  @IsOptional()
  @IsEnum(ProductVariantSize)
  size?: ProductVariantSize;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stock?: number;
}
