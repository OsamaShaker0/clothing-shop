import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerifyUserEamilDto {
  @ApiProperty({
    description: 'User email to verify',
    example: 'test@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'Verification code received in email',
    example: 'ABC123XYZ',
  })
  @IsNotEmpty()
  @IsString()
  verifyCode: string;
}
