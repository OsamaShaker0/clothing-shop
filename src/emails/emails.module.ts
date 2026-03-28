import { Module } from '@nestjs/common';
import { EmailService } from './providers/email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';
import { SendVerifyEmailProvider } from './providers/send-verify-email.provider';
import { EmailTransporterProvider } from './providers/email-transporter.provider';
import appConfig from 'src/config/app.config';

@Module({
  providers: [EmailService, SendVerifyEmailProvider, EmailTransporterProvider],
  controllers: [EmailController],
  imports: [ConfigModule.forFeature(appConfig)],
  exports: [EmailService],
})
export class EmailsModule {}
