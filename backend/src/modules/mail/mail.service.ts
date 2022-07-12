import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  @Inject(MailerService)
  private mailerService: MailerService;

  async sendUserConfirmation() {
    await this.mailerService.sendMail({
      to: 'sheva8dim@gmail.com',
      subject: 'CONFIRM',
      template: './confirmation',
      context: {
        name: 'name',
        url: 'blablabla',
      },
    });
  }
}
