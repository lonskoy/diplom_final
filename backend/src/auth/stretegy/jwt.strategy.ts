import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configServise: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServise.get<string>('JWT_SECRET'), // Используйте переменную окружения в реальных приложениях
    });
  }

  async validate(payload: any) {
    return { userId: payload.id, userRole: payload.role, username: payload.name };
  }
}
