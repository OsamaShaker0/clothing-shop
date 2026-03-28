import { Injectable } from '@nestjs/common';
import { SendVerifyEmailProvider } from './send-verify-email.provider';
import { SendVerifyEmailDto } from '../dtos/send-verify-email.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly sendVerifyEmailProvider: SendVerifyEmailProvider,
  ) {}

  public async sendVerfiyUserEamil(sendVerfiyEamilDto: SendVerifyEmailDto) {
    return this.sendVerifyEmailProvider.sendVerfiyEmail(sendVerfiyEamilDto);
  }
}
