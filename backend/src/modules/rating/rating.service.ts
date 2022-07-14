import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class RatingService {
  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  getNewRating(whiteUser, blackUser): [number, number] {
    this.checkPoints(whiteUser.point, blackUser.point);
    this.checkRatings(whiteUser.rating, blackUser.rating);
    this.checkParties(whiteUser.parties, blackUser.parties);

    const factorWhite =
      1 / (1 + Math.pow(10, (blackUser.rating - whiteUser.rating) / 400));
    const factorBlack =
      1 / (1 + Math.pow(10, (whiteUser.rating - blackUser.rating) / 400));

    const coefficientWhite = this.getCoefficient({ ...whiteUser });
    const coefficientBlack = this.getCoefficient({ ...blackUser });

    const whiteUserRating = Math.round(
      whiteUser.rating + coefficientWhite * (whiteUser.point - factorWhite),
    );
    const blackUserRating = Math.round(
      blackUser.rating + coefficientBlack * (blackUser.point - factorBlack),
    );

    return [whiteUserRating, blackUserRating];
  }

  async getUsersRating() {
    return this.userSchema
      .find(
        { parties: { $gte: 1 } },
        { username: 1, parties: 1, partiesWon: 1, rating: 1, _id: 0 },
      )
      .sort({ rating: -1 })
      .limit(10);
  }

  private checkPoints(whitePoint, blackPoint) {
    const isWrongCoordinate = !(
      (whitePoint === 1 && blackPoint === 0) ||
      (whitePoint === 0.5 && blackPoint === 0.5) ||
      (whitePoint === 0 && blackPoint === 1)
    );

    if (isWrongCoordinate) throw new Error('Wrong coordinate');
  }

  private checkRatings(whiteRating, blackRating) {
    const isWrongRating =
      whiteRating < 0 ||
      !Number.isInteger(whiteRating) ||
      blackRating < 0 ||
      !Number.isInteger(blackRating);

    if (isWrongRating) throw new Error('Wrong rating');
  }

  private checkParties(whiteParties, blackParties) {
    const isWrongParties =
      whiteParties < 0 ||
      !Number.isInteger(whiteParties) ||
      blackParties < 0 ||
      !Number.isInteger(blackParties);

    if (isWrongParties) throw new Error('Wrong parties');
  }

  private getCoefficient({
    rating,
    parties,
  }: {
    rating: number;
    parties: number;
  }) {
    if (parties < 30 && rating >= 2400) return 20;
    if (parties < 30) return 40;
    if (rating >= 2400) return 10;
    return 20;
  }
}
