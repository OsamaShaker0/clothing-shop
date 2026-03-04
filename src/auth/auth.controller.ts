import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/auth-signin.dto';
import { LoginDto } from './dtos/auth-login.dto';
import { Public } from './decorators/public.decorator';

@Public()
@UseInterceptors(ClassSerializerInterceptor)

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  @Post('login')
  public async logIn(@Body() logInDto: LoginDto) {
    return this.authService.logIn(logInDto);
  }
}
