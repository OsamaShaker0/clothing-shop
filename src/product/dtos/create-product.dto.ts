import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';
import { GenderEnum } from '../enums/product-gender.enum';
import { Type } from 'class-transformer';
import { ProductTypeEnum } from '../enums/product-type.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  priceAfterDiscount?: number;

  @IsOptional()
  @IsUrl()
  image?: string[];
  @IsNotEmpty()
  @IsEnum(ProductTypeEnum, {
    message: 'product type must be one of: trousers,shirt, dress,skirt,others',
  })
  productType: ProductTypeEnum;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
  @IsNotEmpty()
  @IsEnum(GenderEnum, { message: 'gender must be one of: male, female, both' })
  gender: GenderEnum;
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  stock: number;
}
