import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export function getTelegramConfig(): ITelegramOptions {
  return {
    token: '',
    chatId: '',
  };
}
