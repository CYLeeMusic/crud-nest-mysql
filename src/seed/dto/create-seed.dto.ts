import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsDate,
  IsArray,
} from 'class-validator';
import { SeedType } from '../entities/seed.entity';

export class CreateSeedDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: SeedType;

  @IsNotEmpty()
  @IsString()
  producer: string;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;

  @IsNotEmpty()
  @IsDate()
  harvestDate: Date;

  @IsArray()
  growingConditions: string[];
}
