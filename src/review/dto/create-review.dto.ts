import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  productId: string;
}
