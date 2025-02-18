import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentService } from '../../core/enviroment/enviroment.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private environmentService: EnvironmentService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.['access_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: environmentService.secret,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userModel.findById(payload.id);

      if (!user) {
        console.error('Пользователь не найден');
        throw new UnauthorizedException('Пользователь не аутентифицирован');
      }

      if (user.role !== 'admin') {
        console.error('Пользователь не администратор');
        throw new ForbiddenException('Недостаточно прав');
      }

      console.log('Пользователь является админом');
      return user; 
    } catch (error: any) {
      console.error('Ошибка при валидации пользователя:', error.message);
      throw error; 
    }
  }
}