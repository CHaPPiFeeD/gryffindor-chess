import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Game } from '../../models/game.model';
import { Party, PartyDocument } from '../../schemas/party.schema';
import { RatingService } from '../rating/rating.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PartyService {
  @InjectModel(Party.name)
  private partySchema: Model<PartyDocument>;

  @Inject(UserService)
  private userService: UserService;

  @Inject(RatingService)
  private ratingService: RatingService;

  async create(game: Game) {
    const whiteId: ObjectId = game.white.userId;
    const blackId: ObjectId = game.black.userId;
    this.updateParties(whiteId, blackId, game.winner);
    await this.partySchema.create({ ...game });
  }

  private async updateParties(
    whiteId: ObjectId,
    blackid: ObjectId,
    winner: ObjectId | null,
  ) {
    const userWhite = await this.userService.findOne(
      { _id: whiteId },
      { rating: 1, parties: 1, partiesWon: 1 },
    );
    const userBlack = await this.userService.findOne(
      { _id: blackid },
      { rating: 1, parties: 1, partiesWon: 1 },
    );

    userWhite.parties += 1;
    userBlack.parties += 1;
    if (whiteId === winner) userWhite.partiesWon += 1;
    if (blackid === winner) userBlack.partiesWon += 1;

    const [whiteRating, blackRating] = this.updateRate(
      userBlack,
      userWhite,
      winner,
    );

    userWhite.rating = whiteRating;
    userBlack.rating = blackRating;
    await this.userService.updateOne({ _id: whiteId }, { ...userWhite });
    await this.userService.updateOne({ _id: blackid }, { ...userBlack });
  }

  private updateRate(userWhite, userBlack, winner: ObjectId | null) {
    if (winner === null) {
      userWhite.point = 0.5;
      userBlack.point = 0.5;
    } else if (winner === userWhite._id) {
      userWhite.point = 1;
      userBlack.point = 0;
    } else if (winner === userBlack._id) {
      userWhite.point = 0;
      userBlack.point = 1;
    } else throw new Error('Winner is incorrect');

    const [whiteRating, blackRating] = this.ratingService.getNewRating(
      userWhite,
      userBlack,
    );

    return [whiteRating, blackRating];
  }
}
