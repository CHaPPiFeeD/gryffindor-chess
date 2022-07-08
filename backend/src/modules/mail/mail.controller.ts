import { Controller, Inject, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  @Inject(MailService)
  private mailService: MailService;

  @Post('/api/mail')
  sendMail() {
    this.mailService.sendUserConfirmation();
  }
}
