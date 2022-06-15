import { RatingService } from './rating.service';
import { Test } from '@nestjs/testing';

describe('Rating module', () => {
  let ratingService: RatingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RatingService],
    }).compile();

    ratingService = moduleRef.get<RatingService>(RatingService);
  });

  test('Draw with the same rating', () => {
    const userA = { rating: 1500, point: 0.5, parties: 30 };
    const userB = { rating: 1500, point: 0.5, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 1500,
      rangB: 1500,
    });
  });

  test('UserA win with the same rating', () => {
    const userA = { rating: 1500, point: 1, parties: 30 };
    const userB = { rating: 1500, point: 0, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 1510,
      rangB: 1490,
    });
  });

  test('UserB win with the same rating', () => {
    const userA = { rating: 1500, point: 0, parties: 30 };
    const userB = { rating: 1500, point: 1, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 1490,
      rangB: 1510,
    });
  });

  test('Draw with a rating difference of 100', () => {
    const userA = { rating: 1500, point: 0.5, parties: 30 };
    const userB = { rating: 1600, point: 0.5, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 1503,
      rangB: 1597,
    });
  });

  test('UserA win with a rating difference of 100', () => {
    const userA = { rating: 1500, point: 1, parties: 30 };
    const userB = { rating: 1600, point: 0, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 1513,
      rangB: 1587,
    });
  });

  test('UserB win with a rating difference of 100', () => {
    const userA = { rating: 1500, point: 0, parties: 30 };
    const userB = { rating: 1600, point: 1, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 1493,
      rangB: 1607,
    });
  });

  test('Check calibration and high rating', () => {
    const userA = { rating: 2300, point: 0, parties: 30 };
    const userB = { rating: 2500, point: 1, parties: 0 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 2295,
      rangB: 2505,
    });
  });

  test('Check calibration', () => {
    const userA = { rating: 1500, point: 0, parties: 30 };
    const userB = { rating: 1500, point: 1, parties: 0 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 1490,
      rangB: 1520,
    });
  });

  test('Check high rating', () => {
    const userA = { rating: 2399, point: 0, parties: 30 };
    const userB = { rating: 2400, point: 1, parties: 30 };
    expect(ratingService.getNewRating(userA, userB)).toEqual({
      rangA: 2389,
      rangB: 2405,
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
});
