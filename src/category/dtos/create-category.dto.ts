import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Product } from 'src/product/product.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(512)
  description: string;
  @IsUrl()
  @IsOptional()
  photo: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
