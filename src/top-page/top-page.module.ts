import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageController } from './top-page.controller';
import { TopPageSchema } from './top-page.model';

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
})
export class TopPageModule {}
