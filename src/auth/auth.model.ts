import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = AuthModel & Document;

@Schema({ timestamps: true, _id: true })
export class AuthModel {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  passwordHash: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
