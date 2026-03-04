import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingProvider } from './hashing.provider';
@Injectable()
export class BcryptProvider extends HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(data, salt);
      return hashedPassword;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went wrong , try again',
        { description: String(error) },
      );
    }
  }
  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(data, encrypted);
      return isMatch;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went wrong , try again',
        { description: String(error) },
      );
    }
  }
}
