import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService  {
  private readonly _url_mongo: string | undefined;
  private readonly _port: string | undefined;
  private readonly _secret: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this._url_mongo = this.configService.get('URL_MONGO');
    this._port = this.configService.get('PORT');
    this._secret = this.configService.get('JWT_SECRET')
  }

  get url_mongo() {
    return this._url_mongo;
  }

  get secret() {
    return this._secret;
  }

  get port() {
    return Number(this._port);
  }
}