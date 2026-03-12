import { Request } from 'express';
import { UserRole } from 'src/user/enums/user-roles.enum';

export interface RequestWithActor extends Request {
  actor: {
    type: string;
    sub: string;
    role: UserRole;
  };
}
