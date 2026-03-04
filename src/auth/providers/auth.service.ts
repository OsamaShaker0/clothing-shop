import { Injectable } from '@nestjs/common';
import { SigninProvider } from './signin.provider';
import { LoginAuthProvider } from './login-auth.provider';
import {  SignUpDto } from '../dtos/auth-signup.dto';
import { LoginDto } from '../dtos/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signinProdiver: SigninProvider,
    private readonly loginProvider: LoginAuthProvider,
  ) {}
  public async signIn(signUpDto: SignUpDto) {
    return this.signinProdiver.signIn(signUpDto);
  }
  public async logIn(logInDto: LoginDto) {
    return this.loginProvider.login(logInDto);
  }
}
