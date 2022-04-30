import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { USER_EXISTS } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const user = await this.authService.createUser(dto);

    if (!user) {
      throw new HttpException(USER_EXISTS, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async post(@Body() dto: AuthDto) {}
}
