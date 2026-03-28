import { ConflictException, Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../dtos/auth-signup.dto';
import { EmailService } from 'src/emails/providers/email.service';

@Injectable()
export class SignupProvider {
  constructor(
    private readonly hashingProvider: HashingProvider,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly emailService: EmailService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: signUpDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      signUpDto.password,
    );

    let user = this.usersRepository.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const verifyToken = await this.emailService.sendVerfiyUserEamil({
      recipient: signUpDto.email,
    });

    user.emailVerificationToken =
      await this.hashingProvider.hashPassword(verifyToken);

    user = await this.usersRepository.save(user);

    return { message: 'Check your email to verify it' };
  }
}
