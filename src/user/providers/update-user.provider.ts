import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users.entity';
import { Repository } from 'typeorm';
import { GetOneUserProvider } from './get-one-user.provider';
import { UpdateUserDto } from '../dtos/update-user.dto';
@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly getOneUserProvider: GetOneUserProvider,
  ) {}
  public async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.getOneUserProvider.getOneUserById(id);

    try {
      user = this.usersRepository.merge(user, updateUserDto);
      user = await this.usersRepository.save(user);
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong, try again',
        {
          description: String(error),
        },
      );
    }
  }
}
