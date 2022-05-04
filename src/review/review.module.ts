import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModule } from 'src/telegram/telegram.module';
import { ReviewController } from './review.controller';
import { ReviewSchema } from './review.model';
import { ReviewService } from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Review',
        schema: ReviewSchema,
      },
    ]),
    TelegramModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
