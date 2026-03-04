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

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  lastName: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;
  @IsNotEmpty()
  @IsEnum(UserGender)
  gender: UserGender;
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  @Type(() => Number)
  age?: number;
  @IsOptional()
  @IsString()
  @MaxLength(100)
  governorate?: string;
}
