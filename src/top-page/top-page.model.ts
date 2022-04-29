import { Prop, Schema, PropOptions, SchemaFactory } from '@nestjs/mongoose';
import { BasicModel } from 'src/common/basic.model';
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

@Schema()
export class TopPageModel extends BasicModel {
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
