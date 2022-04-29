import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BasicModel } from 'src/common/basic.model';
import { Document } from 'mongoose';

export type ReviewDocument = ReviewModel & Document;
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
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
