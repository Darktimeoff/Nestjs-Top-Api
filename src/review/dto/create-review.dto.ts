import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Не передано name' })
  name: string;

  @IsString({ message: 'Не передано description' })
  description: string;

  @IsString({ message: 'Не переданый title' })
  title: string;

  @IsNumber(undefined, { message: 'Не переданный rating' })
  @Min(1, { message: 'Минимальное значение 1' })
  @Max(5, { message: 'Максимальное значение 5' })
  rating: number;

  @IsNumber(undefined, { message: 'Не переданный rating' })
  productId: string;
}
