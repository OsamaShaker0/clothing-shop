import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCouponPercentageDto {
  @ApiProperty({
    description: 'New discount percentage for the coupon',
    example: 15,
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  percentage: number;
}
