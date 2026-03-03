import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users.entity';
import { Repository } from 'typeorm';
import { GetOneUserProvider } from './get-one-user.provider';
@Injectable()
export class DeleteUserProvider {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly getOneUserProvider: GetOneUserProvider,
  ) {}
  public async deleteUserById(id: string) {
    const user = await this.getOneUserProvider.getOneUserById(id);
    try {
      await this.usersRepository.remove(user);
      return { message: 'user deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went wrong , please try later',
        { description: String(error) },
      );
    }
  }
}
