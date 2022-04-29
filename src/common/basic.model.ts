import { Prop } from '@nestjs/mongoose';

export class BasicModel {
  @Prop()
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
