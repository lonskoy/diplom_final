import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config/dist';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configServise: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies['access_token']]),
      ignoreExpiration: false,
      secretOrKey: configServise.get<string>('JWT_SECRET'), // Используйте переменную окружения в реальных приложениях
    });
  }

  async validate(payload: any) {
    console.log(payload);
  }
}
