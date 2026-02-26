import { Type } from 'class-transformer';
import { IsInt, IsOptional, MinLength } from 'class-validator';

export class FindCategoryDto {
  @IsInt()
  @IsOptional()
  @MinLength(1)
  @Type(() => Number)
  limit: number;
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @MinLength(1)
  page: number;
}
