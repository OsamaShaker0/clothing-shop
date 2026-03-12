import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cart } from 'src/cart/cart.entity';
import jwtConfig from 'src/config/jwt.config';
import { UserRole } from 'src/user/enums/user-roles.enum';
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
  public async checkForCartOwner(cart: Cart, authHeader?: string) {
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

    if (token) {
      const payload = await this.verifyToken(token);

      if (
        payload.role !== UserRole.ADMIN &&
        payload.sub !== cart.user?.id &&
        payload.sub !== cart.guestId
      ) {
        throw new UnauthorizedException();
      }
    }
  }
}
