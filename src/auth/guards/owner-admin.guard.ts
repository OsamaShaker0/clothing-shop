import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/enums/user-roles.enum';
import { DataSource } from 'typeorm';
import { OwnerCheckOptions } from '../interfaces/owner-check-options.interface';
import { OWNER_CHECK_KEY } from '../decorators/owner-check.decorator';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    private readonly dataSource: DataSource,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const actor = request.actor;

    if (!actor) {
      throw new ForbiddenException('No Actor Found');
    }
    if (actor.role === UserRole.ADMIN) return true;

    const options = this.reflector.get<OwnerCheckOptions>(
      OWNER_CHECK_KEY,
      context.getHandler(),
    );

    if (!options) return true;
    const { entity, param, ownerField } = options;

    const id = request.params[param];
    const repo = this.dataSource.getRepository(entity);
    const record = await repo.findOneBy({ id });
    if (!record) {
      throw new ForbiddenException('Resource Not Found');
    }

    // Check ownership
    let isOwner = false;
    if (typeof ownerField === 'string') {
      isOwner = record[ownerField] === actor.sub;
    } else {
      // array length 2 guaranteed
      isOwner =
        record[ownerField[0]] === actor.sub ||
        record[ownerField[1]] === actor.sub;
    }

    if (!isOwner) {
      throw new ForbiddenException('Not Allowed');
    }

    return true;
  }
}
