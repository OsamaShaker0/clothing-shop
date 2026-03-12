import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserRole } from 'src/user/enums/user-roles.enum';
import { GenerateJwtProvider } from '../providers/generate-jwt.provider';
import { ActorType } from 'src/cart/enums/actor-type.enum';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private generateJwtProvider: GenerateJwtProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization?.trim();
    const guestId = request.headers?.['x-guest-id'];

    // register user auth with token
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const payload = await this.generateJwtProvider.verifyToken(token);
        request.actor = { type: ActorType.NORMAL_USER, ...payload };
        return true;
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    // guset auth
    if (guestId) {
      request.actor = {
        type: ActorType.GUEST,
        sub: guestId,
        role: UserRole.USER,
      };

      return true;
    }

    throw new UnauthorizedException('Authentication required');
  }
}
