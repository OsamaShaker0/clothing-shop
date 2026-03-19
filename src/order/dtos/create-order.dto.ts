import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'First name of the customer',
    minLength: 3,
    maxLength: 30,
    example: 'Osama',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
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
    example: PaymentMethod.CASH,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  payment?: PaymentMethod;
}
