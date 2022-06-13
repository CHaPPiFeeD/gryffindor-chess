import { Controller, Get, Inject } from '@nestjs/common';
import { PartyService } from './party.service';

@Controller()
export class PartyController {
  @Inject(PartyService)
  private partyService: PartyService;

  @Get('/api/party/rate')
  register() {
    return this.partyService.getRate();
  }
}
