import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export async function getMongoConfig(
  configService: ConfigService,
): Promise<MongooseModuleOptions> {
  return {
    uri: getMongoString(configService),
  };
}

function getMongoString(configService: ConfigService) {
  const login = configService.get('MONGO_LOGIN');
  const password = configService.get('MONGO_PASSWORD');
  const host = configService.get('MONGO_HOST');
  const port = configService.get('MONGO_PORT');
  const auth = configService.get('MONGO_AUTHDATABASE');

  return `mongodb://${login}:${password}@${host}:${port}/${auth}`;
}
