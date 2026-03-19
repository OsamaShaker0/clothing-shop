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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Summer Shirt',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    description: 'Slug of the product for URLs',
    example: 'summer-shirt',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A lightweight summer shirt made of cotton.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({
    description: 'Price of the product',
    minimum: 0,
    example: 49.99,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  priceAfterDiscount?: number;
  @ApiPropertyOptional({
    description: 'Price after discount (optional)',
    minimum: 0,
    example: 39.99,
  })
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    description: 'Array of product image URLs (optional)',
    type: [String],
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  })
  imagesUrl?: string[];
  @ApiProperty({
    description: 'Product type',
    enum: ProductTypeEnum,
    example: ProductTypeEnum.SHIRT,
  })
  @IsNotEmpty()
  @IsEnum(ProductTypeEnum, {
    message: 'product type must be one of: trousers,shirt, dress,skirt,others',
  })
  productType: ProductTypeEnum;

  @ApiPropertyOptional({
    description: 'Whether the product is active or not',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  @ApiProperty({
    description: 'Category ID the product belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
  @ApiProperty({
    description: 'Gender category for the product',
    enum: GenderEnum,
    example: GenderEnum.MALE,
  })
  @IsNotEmpty()
  @IsEnum(GenderEnum, { message: 'gender must be one of: male, female, both' })
  gender: GenderEnum;
  @ApiProperty({
    description: 'Stock quantity of the product',
    minimum: 0,
    example: 100,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  stock: number;
}
