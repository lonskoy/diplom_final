import { Module, OnModuleInit } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { AuthController } from './auth/auth.controller';
import mongoose from 'mongoose';
// import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://lonskoy0304:QeV6cIoPj2x5Y3K6@cluster0.lb8c1lp.mongodb.net/diplom?retryWrites=true&w=majority'), // как перенести в env??
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Делает конфигурацию env доступной во всем приложении
      envFilePath: '../.env'
    })
  ],
  // controllers: [AppController, UsersController, AuthController],
  // providers: [AppService, AuthService],
})

export class AppModule implements OnModuleInit {
  async onModuleInit() {
    try {
      await mongoose.connect('mongodb+srv://lonskoy0304:QeV6cIoPj2x5Y3K6@cluster0.lb8c1lp.mongodb.net/diplom?retryWrites=true&w=majority');
      console.log('Подключение к БД успешно')
    } catch (error) {
      console.log('Ошибка подключения к БД')
    }
  }
}