import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class ClientStrategy extends PassportStrategy(Strategy, 'client') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies['access_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userModel.findById(payload.id);

      if (!user) {
        console.error('Пользователь не найден');
        throw new UnauthorizedException('Пользователь не аутентифицирован');
      }

      if (user.role !== 'client') {
        console.error('Пользователь не клиент');
        throw new ForbiddenException('Пользователь не является клиентом');
      }

      console.log('Пользователь является клиентом');
      return user; 
    } catch (error: any) {
      console.error('Ошибка при валидации пользователя:', error.message);
      throw error; 
    }
  }
}
