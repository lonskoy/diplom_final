import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { EnvironmentService } from './core/enviroment/enviroment.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // делает валидацию данных DTO, и не пропускает данные не описанные в DTO (объект передачи данных).
  app.use(cookieParser());

  const environmentService = app.get(EnvironmentService);
  const port = environmentService.port;

  await app.listen(port);
  console.log('Сервер запущен на порту:', port);
}

bootstrap();
