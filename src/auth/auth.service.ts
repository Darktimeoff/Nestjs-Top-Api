import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './user.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { genSaltSync, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: AuthDto): Promise<UserDocument | null> {
    const isExist = await this.findUser(dto.login);

    if (isExist) { return null; }

    const salt = genSaltSync(10);
    const passwordHash = await hash(dto.password, salt);

    const newUser = new this.userModel({
      email: dto.login,
      passwordHash,
    });

    return newUser.save();
  }

  async findUser(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async removeUser(email: string) {
    return this.userModel.findOneAndDelete({ email }).exec();
  }
}
