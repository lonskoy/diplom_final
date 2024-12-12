import { Injectable } from '@nestjs/common';
import { IUsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private  usersService: IUsersService, private jwtService: JwtService) { }

    // Авторизация пользователя
    async validateUser(email: string, password: string) {
        const user = await this.usersService.checkUser(email, password)
        if (user) {
            // Удаляем пароль из возвращаемого объекта
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {  id: user.id, role: user.role, name: user.name };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });
        console.log('Токен выдан:', token);
        return { access_token: token };
      }
}

