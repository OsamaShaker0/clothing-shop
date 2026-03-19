import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    minLength: 4,
    example: 'Clothing',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;
  @ApiProperty({
    description: 'Slug for the category (used in URLs)',
    minLength: 4,
    example: 'clothing',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  slug: string;
  @ApiProperty({
    description: 'Description of the category',
    minLength: 4,
    maxLength: 512,
    example:
      'Category for all clothing products including shirts, pants, and dresses.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(512)
  description: string;
  @ApiProperty({
    description: 'Image URL of the category ',
    example: 'https://example.com/category-image.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Whether the category is active (optional)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
