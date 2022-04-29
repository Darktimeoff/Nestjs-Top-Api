import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopPageDocument = TopPageModel & Document;

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class HH {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}

export class Advantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

@Schema({ timestamps: true, _id: true })
export class TopPageModel {
  @Prop({
    enum: TopLevelCategory,
  })
  firstLevelCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop()
  hh?: HH;

  @Prop([Advantage])
  advantages: Advantage[];

  @Prop()
  seoText: string;

  @Prop([String])
  tags: string[];

  @Prop()
  tagsTitle: string;
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
