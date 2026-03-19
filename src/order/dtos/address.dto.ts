import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    description: 'Country of the address',
    example: 'Egypt',
  })
  @IsString()
  country: string;
  @ApiProperty({
    description: 'Governorate or state of the address',
    example: 'Cairo',
  })
  @IsString()
  governorate: string;
  @ApiProperty({
    description: 'Town or city of the address',
    example: 'Maadi',
  })
  @IsString()
  town: string;
  @ApiPropertyOptional({
    description: 'Village or neighborhood (optional)',
    example: 'Al-Maadi Village',
  })
  @IsOptional()
  @IsString()
  village?: string;
  @ApiProperty({
    description: 'Detailed description of the address',
    example: '123 Street Name, Apartment 4',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
