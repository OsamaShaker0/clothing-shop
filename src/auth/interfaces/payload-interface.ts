import { UserRole } from 'src/user/enums/user-roles.enum';

export interface Payload {
  sub: string;
  role: UserRole;
}
