import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-roles.enum';
import { GenerateJwtProvider } from '../providers/generate-jwt.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private generateJwtProvider: GenerateJwtProvider,
  ) {}

  async canActivate(context: ExecutionContext) {
    //  Public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    //  JWT verification
    const request = context.switchToHttp().getRequest<any>();
    const authHeader = request.headers?.authorization?.trim();
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.generateJwtProvider.verifyToken(token);
      request.user = payload; 
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = request.user;

    //  Role-based access
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If admin → allow everything
    if (user.role === UserRole.ADMIN) return true;

    // If route has roles and user role matches → allow
    if (requiredRoles && requiredRoles.includes(user.role)) return true;

    //  Ownership check 
    const paramId = request.params?.id; // to get the id from the request param 
   
    if (paramId && paramId === user.sub) return true;

    // Otherwise → deny
    throw new UnauthorizedException('Forbidden');
  }
}
