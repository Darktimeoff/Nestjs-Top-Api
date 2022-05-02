import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

export class HH {
  @IsNumber()
  count1: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class Advantage {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  @IsString()
  firstLevelCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HH)
  hh?: HH;

  @ValidateNested()
  @IsArray()
  @Type(() => Advantage)
  advantages: Advantage[];

  @IsString()
  seoText: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  tagsTitle: string;
}
