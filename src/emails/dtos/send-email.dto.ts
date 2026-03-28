import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { each: true })
  recipients: string[];
  @IsString()
  @IsNotEmpty()
  subject: string;
  @IsString()
  @IsNotEmpty()
  html: string;
  @IsString()
  @IsOptional()
  text?: string;
}
