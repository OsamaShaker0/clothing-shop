import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateReviewDto {
  @ApiProperty({
    example: 4.5,
    description: 'Rating value for the product (e.g., 1 to 5)',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiPropertyOptional({
    example: 'Great product, highly recommended!',
    description: 'Optional comment about the product',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
