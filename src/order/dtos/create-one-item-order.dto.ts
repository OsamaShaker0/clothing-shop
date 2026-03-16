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
import type { Address } from '../interfaces/address.interface';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CreateOneItemOrderDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;
  @IsNotEmpty()
  @IsUUID()
  productVariantId: string;
  @IsInt()
  @Type(() => Number)
  quantity: number = 1;
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
  @IsOptional()
  @IsEnum(PaymentMethod)
  payment?: PaymentMethod;
}
