import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './user.model';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { USER_NOT_FOUND, USER_WRONG_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto): Promise<UserDocument | null> {
    const isExist = await this.findUser(dto.login);

    if (isExist) {
      return null;
    }

    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);

    const newUser = new this.userModel({
      email: dto.login,
      passwordHash,
    });

    return newUser.save();
  }

  async validateUser({
    login: email,
    password,
  }: AuthDto): Promise<Pick<UserDocument, 'email'>> {
    const existUser = await this.findUser(email);

    if (!existUser) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    const isMatch = await compare(password, existUser.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException(USER_WRONG_PASSWORD);
    }

    return {
      email: existUser.email,
    };
  }

  async findUser(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async removeUser(email: string) {
    return this.userModel.findOneAndDelete({ email }).exec();
  }

  async login(email: string) {
    const payload = { email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }
}
