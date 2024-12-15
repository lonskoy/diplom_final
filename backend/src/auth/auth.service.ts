import { Injectable, Inject } from '@nestjs/common';
import { IUsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUsersService') private readonly usersService: IUsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.checkUser(email, password);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, role: user.role, name: user.name };
    const token = this.jwtService.sign(payload);
    console.log('Token issued:', token);
    return { access_token: token };
  }
}