import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllUsersDto } from '../dtos/get-all-users.dto';

@Injectable()
export class GetUsersProvider {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  public async getAllUsers(getAllUsersDto: GetAllUsersDto) {
    const page = getAllUsersDto.page ?? 1;
    const limit = getAllUsersDto.limit ?? 10;
    const skip = (page - 1) * limit;
    try {
      const [users, total] = await this.usersRepository.findAndCount({
        skip,
        take: limit,
        order: { firstName: 'ASC' },
      });
      return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        users,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'something went wrong , please try  again',
        { description: String(error) },
      );
    }
  }
}
