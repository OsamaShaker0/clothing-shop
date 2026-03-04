import { BadRequestException, Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/users.entity';
import { Repository } from 'typeorm';
import {  SignUpDto } from '../dtos/auth-signup.dto';
import { GenerateJwtProvider } from './generate-jwt.provider';

@Injectable()
export class SigninProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  public async signIn(signUpDto: SignUpDto) {
    let user = await this.usersRepository.findOneBy({ email: signUpDto.email });
    if (user) {
      throw new BadRequestException('User is Exist ');
    }
    signUpDto.password = await this.hashingProvider.hashPassword(
      signUpDto.password,
    );

    user = this.usersRepository.create(signUpDto);
    user = await this.usersRepository.save(user);
    return user;
  }
}
