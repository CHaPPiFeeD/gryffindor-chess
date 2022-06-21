import { RatingService } from './rating.service';
import { Test } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';

describe('Rating module', () => {
  let ratingService: RatingService;
  let ratingController: RatingController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [
        RatingService,
        {
          provide: getModelToken(User.name),
          useClass: MockUserSchema,
        },
      ],
    }).compile();

    ratingController = moduleRef.get<RatingController>(RatingController);
    ratingService = moduleRef.get<RatingService>(RatingService);
  });

  test('Draw with the same rating', () => {
    const userA = { rating: 1500, point: 0.5, parties: 30 };
    const userB = { rating: 1500, point: 0.5, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 1500,
      blackRating: 1500,
    });
  });

  test('UserA win with the same rating', () => {
    const userA = { rating: 1500, point: 1, parties: 30 };
    const userB = { rating: 1500, point: 0, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 1510,
      blackRating: 1490,
    });
  });

  test('UserB win with the same rating', () => {
    const userA = { rating: 1500, point: 0, parties: 30 };
    const userB = { rating: 1500, point: 1, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 1490,
      blackRating: 1510,
    });
  });

  test('Draw with a rating difference of 100', () => {
    const userA = { rating: 1500, point: 0.5, parties: 30 };
    const userB = { rating: 1600, point: 0.5, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 1503,
      blackRating: 1597,
    });
  });

  test('UserA win with a rating difference of 100', () => {
    const userA = { rating: 1500, point: 1, parties: 30 };
    const userB = { rating: 1600, point: 0, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 1513,
      blackRating: 1587,
    });
  });

  test('UserB win with a rating difference of 100', () => {
    const userA = { rating: 1500, point: 0, parties: 30 };
    const userB = { rating: 1600, point: 1, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 1493,
      blackRating: 1607,
    });
  });

  test('Check calibration and high rating', () => {
    const userA = { rating: 2300, point: 0, parties: 30 };
    const userB = { rating: 2500, point: 1, parties: 0 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 2295,
      blackRating: 2505,
    });
  });

  test('Check calibration', () => {
    const userA = { rating: 1500, point: 0, parties: 30 };
    const userB = { rating: 1500, point: 1, parties: 0 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 1490,
      blackRating: 1520,
    });
  });

  test('Check high rating', () => {
    const userA = { rating: 2399, point: 0, parties: 30 };
    const userB = { rating: 2400, point: 1, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      whiteRating: 2389,
      blackRating: 2405,
    });
  });

  test('Wrong rating', () => {
    const userA = { rating: -1500, point: 1, parties: 30 };
    const userB = { rating: 1500, point: 0, parties: 30 };
    expect(() => ratingService.getNewRating(userA, userB)).toThrow();
    userA.rating = 1500.5;
    expect(() => ratingService.getNewRating(userA, userB)).toThrow();
  });

  test('Wrong points', () => {
    const userA = { rating: 1500, point: 0.5, parties: 30 };
    const userB = { rating: 1500, point: 0, parties: 30 };
    expect(() => ratingService.getNewRating(userA, userB)).toThrow();
    userA.point = 1.5;
    expect(() => ratingService.getNewRating(userA, userB)).toThrow();
  });

  test('Wrong parties', () => {
    const userA = { rating: 1500, point: 1, parties: -30 };
    const userB = { rating: 1500, point: 0, parties: 30 };
    expect(() => ratingService.getNewRating(userA, userB)).toThrow();
    userA.parties = 30.5;
    expect(() => ratingService.getNewRating(userA, userB)).toThrow();
  });

  test('Check provider (get users rating)', async () => {
    const data = await ratingController.getRate();
    console.log(data);
  });
});

class MockUserSchema {
  find() {
    return this;
  }
  sort() {
    return this;
  }
  limit() {
    return this;
  }
}
