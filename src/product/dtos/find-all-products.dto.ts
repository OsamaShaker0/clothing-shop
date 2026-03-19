import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllProductsDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
  @ApiPropertyOptional({
    description: 'Page number to retrieve',
    type: Number,
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}
