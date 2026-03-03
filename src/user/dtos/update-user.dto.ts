import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  firstName?: string;
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  lastName?: string;
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  @Type(() => Number)
  age?: number;
  @IsOptional()
  @IsString()
  @MaxLength(100)
  governorate?: string;
}
