import { SetMetadata } from '@nestjs/common';
import { OwnerCheckOptions } from '../interfaces/owner-check-options.interface';

export const OWNER_CHECK_KEY = 'owner_check';

export const OwnerCheck = (options: OwnerCheckOptions) =>
  SetMetadata(OWNER_CHECK_KEY, options);
