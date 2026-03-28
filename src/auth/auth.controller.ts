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
import { VerifyUserEamilDto } from './dtos/verify-user-email.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
@Public()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiBody({ type: SignUpDto })
  public async signIn(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBody({ type: LoginDto })
  public async logIn(@Body() logInDto: LoginDto) {
    return this.authService.logIn(logInDto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email with code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiBody({ type: VerifyUserEamilDto })
  public async verifyUserEmail(@Body() verifyUserEamilDto: VerifyUserEamilDto) {
    return this.authService.verifyUserEamil(verifyUserEamilDto);
  }
}
