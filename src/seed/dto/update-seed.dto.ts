import {
  IsString,
  IsBoolean,
  IsDate,
  IsArray,
  IsOptional,
} from 'class-validator';
import { SeedType } from '../entities/seed.entity';

export class UpdateSeedDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: SeedType;

  @IsOptional()
  @IsString()
  producer?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsDate()
  harvestDate?: Date;

  @IsOptional()
  @IsArray()
  growingConditions?: string[];
}
