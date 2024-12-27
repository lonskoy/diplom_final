import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Указывайте свой домен, с которого разрешен доступ
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
    credentials: true // Разрешите куки
  });
  app.setGlobalPrefix('api') // глобальный префикс для всех модулей
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // для валидации полей с помощью dto 
  app.use(cookieParser()); // добавляет возможность читать куки

  const configService = app.get(ConfigService); // Получение ConfigService через Nest.js DI
  const port = configService.get<number>('PORT');

  await app.listen(Number(port));
  console.log('Сервер запущен на порту:', port);
}

bootstrap();