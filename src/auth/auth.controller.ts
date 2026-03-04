import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignUpDto } from './dtos/auth-signup.dto';
import { LoginDto } from './dtos/auth-login.dto';
import { Public } from './decorators/public.decorator';

@Public()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  public async signIn(@Body() signUpDto: SignUpDto) {
    return this.authService.signIn(signUpDto);
  }
  @Post('login')
  public async logIn(@Body() logInDto: LoginDto) {
    return this.authService.logIn(logInDto);
  }
}
