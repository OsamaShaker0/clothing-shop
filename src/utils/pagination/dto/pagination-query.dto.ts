import { IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;
  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.ASC;

  // filtering options
  @ApiPropertyOptional({
    description: 'Filter by name',
    example: 'first one',
  })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiPropertyOptional({ description: 'Filter by color', example: 'red' })
  @IsOptional()
  @IsString()
  color?: string;
  @ApiPropertyOptional({ description: 'Filter by gender', example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string;
  @ApiPropertyOptional({ description: 'Minimum price filter', example: 10 })
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;
  @ApiPropertyOptional({ description: 'Maximum price filter', example: 100 })
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}
