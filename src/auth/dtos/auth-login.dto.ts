import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
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
}
