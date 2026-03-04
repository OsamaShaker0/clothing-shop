import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetOneUserProvider {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  public async getOneUserById(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`can not find user with id of ${id}`);
      }
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'something went wrong , please try  again',
        { description: String(error) },
      );
    }
  }
  public async getOneUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException(`can not find user with id of ${email}`);
      }
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'something went wrong , please try  again',
        { description: String(error) },
      );
    }
  }
}
