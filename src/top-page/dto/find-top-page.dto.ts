import { IsEnum, IsString } from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

export class FindTopPageDto {
  @IsEnum(TopLevelCategory)
  @IsString()
  firstCategory: TopLevelCategory;
}
