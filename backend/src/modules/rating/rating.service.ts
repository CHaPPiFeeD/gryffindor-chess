import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UserService } from '../user/user.service';

@Injectable()
export class RatingService {
  @Inject(UserService)
  private userService: UserService;

  getNewRating(userA: User, userB: User): { rangA: number; rangB: number } {
    const isWrongCoordinate = !(
      (userA.point === 1 && userB.point === 0) ||
      (userA.point === 0.5 && userB.point === 0.5) ||
      (userA.point === 0 && userB.point === 1)
    );

    const isWrongRating =
      userA.rating < 0 ||
      !Number.isInteger(userA.rating) ||
      userB.rating < 0 ||
      !Number.isInteger(userB.rating);

    const isWrongParties =
      userA.parties < 0 ||
      !Number.isInteger(userA.parties) ||
      userB.parties < 0 ||
      !Number.isInteger(userB.parties);

    if (isWrongCoordinate) throw new Error('Wrong coordinate');
    if (isWrongRating) throw new Error('Wrong rating');
    if (isWrongParties) throw new Error('Wrong parties');

    const pointA = 1 / (1 + Math.pow(10, (userB.rating - userA.rating) / 400));
    const pointB = 1 / (1 + Math.pow(10, (userA.rating - userB.rating) / 400));

    const coefficientA = this.getCoefficient({ ...userA });
    const coefficientB = this.getCoefficient({ ...userB });

    const newRangA = Math.round(
      userA.rating + coefficientA * (userA.point - pointA),
    );

    const newRangB = Math.round(
      userB.rating + coefficientB * (userB.point - pointB),
    );

    return { rangA: newRangA, rangB: newRangB };
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

type User = {
  userId?: ObjectId;
  rating: number;
  point: number;
  parties: number;
};
