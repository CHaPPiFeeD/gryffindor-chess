import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from 'src/models/game.model';
import { Party, PartyDocument } from 'src/schemas/party.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class PartyService {
  @InjectModel(Party.name)
  private partySchema: Model<PartyDocument>;

  @Inject(UserService)
  private userService: UserService;

  create(game: Game) {
    if (game.winner === game.white.userId) {
      this.userService.updateParties(game.white.userId, true);
      this.userService.updateParties(game.black.userId, false);
    }

    if (game.winner === game.black.userId) {
      this.userService.updateParties(game.white.userId, false);
      this.userService.updateParties(game.black.userId, true);
    }

    this.partySchema.create({ ...game });
  }
}
