import { Injectable } from '@nestjs/common';
import { SigninProvider } from './signin.provider';
import { LoginAuthProvider } from './login-auth.provider';
import { SignInDto } from '../dtos/auth-signin.dto';
import { LoginDto } from '../dtos/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signinProdiver: SigninProvider,
    private readonly loginProvider: LoginAuthProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return this.signinProdiver.signIn(signInDto);
  }
  public async logIn(logInDto: LoginDto) {
    return this.loginProvider.login(logInDto);
  }
}
