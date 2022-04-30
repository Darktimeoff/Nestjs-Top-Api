import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail(undefined, { message: 'введите коректный email' })
  login: string;

  @IsString()
  password: string;
}
