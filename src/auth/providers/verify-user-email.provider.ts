import { BadRequestException, Injectable } from '@nestjs/common';
import { VerifyUserEamilDto } from '../dtos/verify-user-email.dto';
import { HashingProvider } from './hashing.provider';
import { UsersService } from 'src/user/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/users.entity';
import { Repository } from 'typeorm';
@Injectable()
export class VerifyUserEmailProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,

    private readonly userService: UsersService,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  public async verifyUserEamil(verifyUserEamilDto: VerifyUserEamilDto) {
    // find user by email
    const user = await this.userService.getOneUserByEmail(
      verifyUserEamilDto.email,
    );
    if (user.emailVerificationToken == null) {
      throw new BadRequestException('something went wrong , please contact us');
    }
    const match = await this.hashingProvider.comparePassword(
      verifyUserEamilDto.verifyCode,
      user.emailVerificationToken,
    );
    if (!match) {
      throw new BadRequestException('Invalid Code');
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = null;

    await this.usersRepository.save(user);
    return { message: 'Email verified successfully' };
  }
}
