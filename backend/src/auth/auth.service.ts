import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express'
import * as cookie from 'cookie'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.checkUser(email, password);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = { id: user._id };
    const access_token = this.jwtService.sign(payload);
    console.log('Предоставлен токен:', access_token);

    response.setHeader(                                            //устнавливаем токен в заголовок cookie
      'Set-Cookie',
      cookie.serialize('access_token', String(access_token), {
        maxAge: 3600, // 1 час
        httpOnly: true, // Чтобы куки не были доступны через JavaScript
        secure: process.env.NODE_ENV === 'production', // Только HTTPS в продакшене
        sameSite: 'strict', // Защита от CSRF
        path: '/', // Для всех путей
    }),
    );
    response.send({ role: user.role, name: user.name }); // отправка
    return response.end(); // завершение сессии 
  }

  async logout(response: Response) {
    response.setHeader(
      'Set-Cookie',
      cookie.serialize('access_token', '', {
        maxAge: 0, // Устанавливаем срок действия на 0, чтобы удалить куки
        domain: 'localhost',
        path: '/',
      }),
    );
    console.log('Пользователь вышел из системы')
    response.send({ message: 'Вы успешно вышли из системы' });
  }
}
