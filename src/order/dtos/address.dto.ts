import { IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  country: string;

  @IsString()
  governorate: string;

  @IsString()
  town: string;

  @IsOptional()
  @IsString()
  village?: string;

  @IsString()
  description: string;
}