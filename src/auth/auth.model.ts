import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BasicModel } from 'src/common/basic.model';
import { Document } from 'mongoose';

export type AuthDocument = AuthModel & Document;

@Schema()
export class AuthModel extends BasicModel {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  passwordHash: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
