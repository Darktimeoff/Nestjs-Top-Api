import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageController } from './top-page.controller';
import { TopPageModel } from './top-page.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TopPage',
        schema: TopPageModel,
      },
    ]),
  ],
  controllers: [TopPageController],
})
export class TopPageModule {}
