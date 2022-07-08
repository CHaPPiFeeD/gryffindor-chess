import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

class ChangeFigure {
  @IsNotEmpty()
  @IsBoolean()
  isChangePawn: boolean;

  @IsNotEmpty()
  @IsString()
  @Matches(/^((?![^qbnr]).)$/)
  chooseFigure: string;
}

export class ChessMoveDto {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  start: number[];

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  end: number[];

  @ValidateNested()
  @Type(() => ChangeFigure)
  changeFigure: ChangeFigure;
}

export class SearchGameDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @Matches(/white|black/, { each: true })
  color: string[];
}
