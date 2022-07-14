import { ApiProperty } from '@nestjs/swagger';

export class UserRatingDto {
  @ApiProperty({ default: 'Name' })
  username: string;

  @ApiProperty({ default: 50 })
  parties: number;

  @ApiProperty({ default: 25 })
  partiesWon: number;

  @ApiProperty({ default: 1700 })
  rating: number;
}
