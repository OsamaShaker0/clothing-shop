import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({
    description: 'Unique code for the coupon',
    example: 'SPRING2026',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
  @ApiProperty({
    description: 'Discount percentage for the coupon',
    example: 20,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  percentage: number;
}
