import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserGender } from 'src/user/enums/user-gender.enum';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'First name of the user',
    minLength: 3,
    maxLength: 30,
    example: 'Osama',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  firstName: string;
  @ApiProperty({
    description: 'Last name of the user',
    minLength: 3,
    maxLength: 30,
    example: 'Shaker',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  lastName: string;
  @ApiProperty({
    description: 'Email address of the user',
    example: 'osama@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
  @ApiProperty({
    description:
      'Password with at least one uppercase, one lowercase, one number and one special character',
    minLength: 8,
    example: 'Passw0rd!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;
  @ApiProperty({
    description: 'Gender of the user',
    enum: UserGender,
    example: UserGender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(UserGender)
  gender: UserGender;
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
