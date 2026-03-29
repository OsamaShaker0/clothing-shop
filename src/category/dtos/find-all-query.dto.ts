import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class FindCategoryDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;
  @ApiPropertyOptional({
    description: 'Search by category name',
    example: 'electronics',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
