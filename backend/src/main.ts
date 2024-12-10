import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Получение ConfigService через Nest.js DI
  const port = configService.get<number>('PORT');

  await app.listen(Number(port));
  console.log('Сервер запущен на порту:', port);
}
bootstrap();