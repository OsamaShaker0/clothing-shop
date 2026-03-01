import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllProductsDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;
}
