import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: ProductModule,
      },
    ]),
  ],
  controllers: [ProductController],
})
export class ProductModule {}
