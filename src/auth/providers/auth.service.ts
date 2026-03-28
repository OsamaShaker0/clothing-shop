import { Injectable } from '@nestjs/common';
import { SignupProvider } from './signup.provider';
import { LoginAuthProvider } from './login-auth.provider';
import { SignUpDto } from '../dtos/auth-signup.dto';
import { LoginDto } from '../dtos/auth-login.dto';
import { VerifyUserEmailProvider } from './verify-user-email.provider';
import { VerifyUserEamilDto } from '../dtos/verify-user-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signinProdiver: SignupProvider,
    private readonly loginProvider: LoginAuthProvider,
    private readonly verifyUserEmailProvider: VerifyUserEmailProvider,
  ) {}
  public async signUp(signUpDto: SignUpDto) {
    return this.signinProdiver.signUp(signUpDto);
  }
  public async logIn(logInDto: LoginDto) {
    return this.loginProvider.login(logInDto);
  }
  public async verifyUserEamil(verifyUserEamilDto: VerifyUserEamilDto) {
    return this.verifyUserEmailProvider.verifyUserEamil(verifyUserEamilDto);
  }
}
