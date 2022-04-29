import { Prop, Schema } from '@nestjs/mongoose';
import { BasicModel } from 'src/common/basic.model';

@Schema()
export class ReviewModel extends BasicModel {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  title: string;

  @Prop()
  rating: number;

  @Prop()
  createdAt: Date;
}
