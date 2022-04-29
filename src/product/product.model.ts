import { Prop, Schema } from '@nestjs/mongoose';
import { BasicModel } from 'src/common/basic.model';

class ProductCharacteristic {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

@Schema()
export class ProductModel extends BasicModel {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  credit: number;

  @Prop()
  calculatedRating: number;

  @Prop()
  description: string;

  @Prop()
  advantages: string;

  @Prop()
  disAdvantages: string;

  @Prop([String])
  categories: string[];

  @Prop([String])
  tags: string[];

  @Prop({ type: [ProductCharacteristic], _id: false })
  characteristics: ProductCharacteristic[];
}
