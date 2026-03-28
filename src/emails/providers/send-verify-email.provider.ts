import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { EmailTransporterProvider } from './email-transporter.provider';
import * as nodemailer from 'nodemailer';
import { SendVerifyEmailDto } from '../dtos/send-verify-email.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class SendVerifyEmailProvider {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,

    private readonly emailTransporterProvider: EmailTransporterProvider,
  ) {}

  private generateSecureToken(length: number = 12) {
    return randomBytes(length).toString('base64url');
  }

  public async sendVerfiyEmail(sendVerfiyEamilDto: SendVerifyEmailDto) {
    const transport = this.emailTransporterProvider.emailTransport();
    const randomToken = this.generateSecureToken();
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.config.emailUser,
      to: sendVerfiyEamilDto.recipient,
      subject: 'VERFIY EMAIL',
      text: `Your verification code is: ${randomToken}`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:10px; text-align:center;">
          
          <h2 style="color:#333;">Verify Your Email</h2>
          
          <p style="color:#555; font-size:16px;">
            Use the code below to verify your email address:
          </p>

          <div style="margin:30px 0;">
            <span style="
              display:inline-block;
              padding:15px 25px;
              font-size:24px;
              letter-spacing:4px;
              background:#000;
              color:#fff;
              border-radius:8px;
              font-weight:bold;
            ">
              ${randomToken}
            </span>
          </div>

          <p style="color:#777; font-size:14px;">
            This code will expire soon. If you didn’t request this, ignore this email.
          </p>

        </div>
      </div>
    `,
    };
    try {
      await transport.sendMail(mailOptions);
      console.log('email sent ');
      return randomToken;
    } catch (error) {
      console.error('error sending email', error);
      throw new InternalServerErrorException(
        'Something went wrong , please tryu again',
      );
    }
  }
}
