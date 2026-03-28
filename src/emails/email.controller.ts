import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './providers/email.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { SendVerifyEmailDto } from './dtos/send-verify-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Post()
  // @Public()
  // public async sendEmail(@Body() sendVerfiyEmailDto: SendVerifyEmailDto) {
  //   return this.emailService.sendVerfiyUserEamil(sendVerfiyEmailDto);
  // }
}
