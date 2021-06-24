import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class UtilsService {
  private readonly mailer: Mail;

  constructor(private readonly configService: ConfigService) {
    this.mailer = nodeMailer.createTransport({
      host: configService.get('MAILER_HOST'),
      port: parseInt(configService.get('MAILER_PORT')),
      secure: false,
      auth: {
        user: configService.get('MAILER_USER'),
        pass: configService.get('MAILER_PSWD'),
      },
    });
  }

  sendMail(sendOptions: nodeMailer.SendMailOptions) {
    try {
      this.mailer.sendMail(sendOptions);
    } catch (error) {
      console.error(error.message);
    }
  }
}
