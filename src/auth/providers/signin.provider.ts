import { BadRequestException, Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/users.entity';
import { Repository } from 'typeorm';
import { SignInDto } from '../dtos/auth-signin.dto';
import { GenerateJwtProvider } from './generate-jwt.provider';
import { classToPlain } from 'class-transformer';

@Injectable()
export class SigninProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly generateJwtToken: GenerateJwtProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    let user = await this.usersRepository.findOneBy({ email: signInDto.email });
    if (user) {
      throw new BadRequestException('User is Exist ');
    }
    signInDto.password = await this.hashingProvider.hashPassword(
      signInDto.password,
    );

    user = this.usersRepository.create(signInDto);
    user = await this.usersRepository.save(user);
    return classToPlain(user);
  }
}
