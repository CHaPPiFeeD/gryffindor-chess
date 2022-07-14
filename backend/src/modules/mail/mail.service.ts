import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  @Inject(MailerService)
  private mailerService: MailerService;

  async sendUserConfirmation(email: string, context: { url: string }) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'CONFIRM',
      template: './confirmation',
      context: {
        url: context.url,
      },
    });
  }
}
