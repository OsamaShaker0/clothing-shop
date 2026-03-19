import {
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOneItemOrderDto {
  @ApiProperty({
    description: 'First name of the customer',
    minLength: 3,
    maxLength: 50,
    example: 'Osama',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;
  @ApiProperty({
    description: 'Last name of the customer',
    minLength: 3,
    maxLength: 50,
    example: 'Shaker',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;
  @ApiProperty({
    description: 'ID of the product variant being ordered',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @IsNotEmpty()
  @IsUUID()
  productVariantId: string;

  @ApiProperty({
    description: 'Quantity of the product variant (default 1)',
    minimum: 1,
    example: 2,
  })
  @IsInt()
  @Type(() => Number)
  quantity: number = 1;
  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+201234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  @ApiProperty({
    description: 'Shipping address of the order',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
  @ApiPropertyOptional({
    description: 'Payment method (optional)',
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  payment?: PaymentMethod;
}
