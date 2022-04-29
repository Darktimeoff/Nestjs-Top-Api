import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from './review.controller';
import { ReviewModel } from './review.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Review',
        schema: ReviewModel,
      },
    ]),
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
