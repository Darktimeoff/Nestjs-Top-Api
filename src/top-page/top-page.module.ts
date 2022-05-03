import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageController } from './top-page.controller';
import { TopPageSchema } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TopPage',
        schema: TopPageSchema,
      },
    ]),
  ],
  controllers: [TopPageController],
  providers: [TopPageService],
  exports: [TopPageService],
})
export class TopPageModule {}
