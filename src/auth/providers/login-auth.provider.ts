import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { UsersService } from 'src/user/providers/users.service';
import { LoginDto } from '../dtos/auth-login.dto';
import { GenerateJwtProvider } from './generate-jwt.provider';

@Injectable()
export class LoginAuthProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,

    private readonly userService: UsersService,
    private readonly generateJwtToken: GenerateJwtProvider,
  ) {}
  public async login(loginDto: LoginDto) {
    const user = await this.userService.getOneUserByEmail(loginDto.email);

    const isMatch = await this.hashingProvider.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credential');
    }

    return this.generateJwtToken.generateAccessToken(user);
  }
}
