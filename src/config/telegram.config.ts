import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export function getTelegramConfig(
  configService: ConfigService,
): ITelegramOptions {
  const token = configService.get<string>('BOT_TOKEN');
  const chatId = configService.get<string>('CHANNEL_ID');

  if (!token) {
    throw new Error('BOT_TOKEN doesn`t defined');
  }

  return {
    token: token,
    chatId: chatId ?? '',
  };
}
