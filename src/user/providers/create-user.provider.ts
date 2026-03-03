import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUsersProvider {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUsers = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUsers) throw new ConflictException('Email already exists');
      let user = this.usersRepository.create(createUserDto);
      user = await this.usersRepository.save(user);
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) throw error;

      throw new InternalServerErrorException(
        'something went wrong please try again',
      );
    }
  }
}
