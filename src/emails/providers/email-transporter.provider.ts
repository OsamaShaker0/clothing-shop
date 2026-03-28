import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailTransporterProvider {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  public  emailTransport() {
    const transport = nodemailer.createTransport({
      host: this.config.emailHost,
      port: this.config.emailPort,
      secure: false,
      auth: {
        user: this.config.emailUser,
        pass: this.config.emailPass,
      },
    });
    return transport;
  }
}
