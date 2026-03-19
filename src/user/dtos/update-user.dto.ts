import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'First name of the user (optional)',
    minLength: 3,
    maxLength: 30,
    example: 'Osama',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the user (optional)',
    minLength: 3,
    maxLength: 30,
    example: 'Shaker',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  lastName?: string;
  @ApiPropertyOptional({
    description: 'Age of the user (optional)',
    minimum: 0,
    maximum: 80,
    example: 25,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  @Type(() => Number)
  age?: number;
  @ApiPropertyOptional({
    description: 'Governorate of the user (optional)',
    maxLength: 100,
    example: 'Cairo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  governorate?: string;
}
