import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import type { Address } from '../interfaces/address.interface';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(50)
  lastName: string;
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  @IsNotEmpty()
  @IsJSON()
  address: Address;
  @IsOptional()
  @IsEnum(PaymentMethod)
  payment?: PaymentMethod;
}
