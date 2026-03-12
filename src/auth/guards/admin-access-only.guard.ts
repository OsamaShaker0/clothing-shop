import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRole } from 'src/user/enums/user-roles.enum';

@Injectable()
export class AdminAccessOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const actor = request?.actor;
    if (!actor) {
      throw new UnauthorizedException('missing token');
    }
    if (actor.role === UserRole.ADMIN) return true;
    throw new ForbiddenException('Unauthorized To Access This Route ');
  }
}
