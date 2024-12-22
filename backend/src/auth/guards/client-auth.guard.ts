import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ClientAuthGuard extends AuthGuard('client') {} // Используется для защиты маршрутов, которые длжны требовать jwt-токен