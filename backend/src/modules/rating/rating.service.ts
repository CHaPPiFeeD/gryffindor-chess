import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class RatingService {
  @InjectModel(User.name)
  private userSchema: Model<UserDocument>;

  getNewRating(
    whiteUser: UserType,
    blackUser: UserType,
  ): { whiteRating: number; blackRating: number } {
    const isWrongCoordinate = !(
      (whiteUser.point === 1 && blackUser.point === 0) ||
      (whiteUser.point === 0.5 && blackUser.point === 0.5) ||
      (whiteUser.point === 0 && blackUser.point === 1)
    );

    const isWrongRating =
      whiteUser.rating < 0 ||
      !Number.isInteger(whiteUser.rating) ||
      blackUser.rating < 0 ||
      !Number.isInteger(blackUser.rating);

    const isWrongParties =
      whiteUser.parties < 0 ||
      !Number.isInteger(whiteUser.parties) ||
      blackUser.parties < 0 ||
      !Number.isInteger(blackUser.parties);

    if (isWrongCoordinate) throw new Error('Wrong coordinate');
    if (isWrongRating) throw new Error('Wrong rating');
    if (isWrongParties) throw new Error('Wrong parties');

    const pointWhite =
      1 / (1 + Math.pow(10, (blackUser.rating - whiteUser.rating) / 400));
    const pointBlack =
      1 / (1 + Math.pow(10, (whiteUser.rating - blackUser.rating) / 400));

    const coefficientWhite = this.getCoefficient({ ...whiteUser });
    const coefficientBlack = this.getCoefficient({ ...blackUser });

    const whiteRating = Math.round(
      whiteUser.rating + coefficientWhite * (whiteUser.point - pointWhite),
    );
    const blackRating = Math.round(
      blackUser.rating + coefficientBlack * (blackUser.point - pointBlack),
    );

    return { whiteRating, blackRating };
  }

  async getUsersRating() {
    return this.userSchema
      .find(
        { parties: { $gte: 1 } },
        { username: 1, parties: 1, partiesWon: 1, rating: 1 },
      )
      .sort({ rating: -1 })
      .limit(10);
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

type UserType = {
  userId?: ObjectId;
  rating: number;
  point: number;
  parties: number;
};
