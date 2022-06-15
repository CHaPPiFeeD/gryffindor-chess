import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Game } from 'src/models/game.model';
import { Party, PartyDocument } from 'src/schemas/party.schema';
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
    const userWhiteId: ObjectId = game.white.userId;
    const userBlackId: ObjectId = game.black.userId;

    this.updateParties(userWhiteId, userBlackId, game.winner);

    await this.partySchema.create({ ...game });
  }

  private async updateParties(
    userWhiteId: ObjectId,
    userBlackId: ObjectId,
    winner: ObjectId | string,
  ) {
    const userWhite = await this.userService.findOne({ _id: userWhiteId });
    const userBlack = await this.userService.findOne({ _id: userBlackId });

    const updateDataWhite: NewDataType = {};
    const updateDataBlack: NewDataType = {};

    updateDataWhite.parties = userWhite.parties + 1;
    updateDataBlack.parties = userBlack.parties + 1;

    updateDataWhite.partiesWon =
      userWhiteId === winner ? userWhite.partiesWon + 1 : userWhite.partiesWon;
    updateDataBlack.partiesWon =
      userBlackId === winner ? userBlack.partiesWon + 1 : userBlack.partiesWon;

    const [whiteRating, blackRating] = this.updateRate({
      whiteId: userWhiteId,
      blackId: userBlackId,
      winner,
      userWhite,
      userBlack,
    });

    updateDataWhite.rating = whiteRating;
    updateDataBlack.rating = blackRating;

    await this.userService.updateOne(
      { _id: userWhiteId },
      { ...updateDataWhite },
    );

    await this.userService.updateOne(
      { _id: userBlackId },
      { ...updateDataBlack },
    );
  }

  private updateRate({
    whiteId,
    blackId,
    winner,
    userWhite,
    userBlack,
  }: {
    whiteId: ObjectId;
    blackId: ObjectId;
    winner: ObjectId | string;
    userWhite: any;
    userBlack: any;
  }) {
    const userA: UserType = {
      rating: userWhite.rating,
      parties: userWhite.parties,
      point: 0,
    };

    const userB: UserType = {
      rating: userBlack.rating,
      parties: userBlack.parties,
      point: 0,
    };

    if (winner === 'draw') {
      userA.point = 0.5;
      userB.point = 0.5;
    } else if (winner === whiteId) {
      userA.point = 1;
      userB.point = 0;
    } else if (winner === blackId) {
      userA.point = 0;
      userB.point = 1;
    } else throw new Error('Winner is incorrect');

    const { whiteRating, blackRating } = this.ratingService.getNewRating(
      userA,
      userB,
    );

    return [whiteRating, blackRating];
  }

  async getRate() {
    return await this.partySchema.find().sort({ parties: 1 }).limit(10);
  }
}

type NewDataType = {
  parties?: number;
  partiesWon?: number;
  rating?: number;
};

type UserType = {
  rating: number;
  parties: number;
  point: number;
};
