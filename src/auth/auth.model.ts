import { Prop, Schema } from '@nestjs/mongoose';
import { BasicModel } from 'src/common/basic.model';

@Schema()
export class AuthModel extends BasicModel {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  passwordHash: string;
}
