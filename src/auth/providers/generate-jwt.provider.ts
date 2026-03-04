import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { Users } from 'src/user/users.entity';

@Injectable()
export class GenerateJwtProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}
  public async generateAccessToken(user: Users) {
    const payload = { sub: user.id, role: user.role };
    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: this.jwtConfigration.secret,
        audience: this.jwtConfigration.signOptions.audience,
        issuer: this.jwtConfigration.signOptions.issuer,
        expiresIn: this.jwtConfigration.signOptions.expiresIn,
      });
      return token;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went  wrong , try again',
        { description: String(error) },
      );
    }
  }
  public async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.jwtConfigration.secret,
      audience: this.jwtConfigration.signOptions.audience,
      issuer: this.jwtConfigration.signOptions.issuer,
    });
  }
}
