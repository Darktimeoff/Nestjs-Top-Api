import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto) {}

  @HttpCode(200)
  @Post('login')
  async post(@Body() dto: AuthDto) {}
}
