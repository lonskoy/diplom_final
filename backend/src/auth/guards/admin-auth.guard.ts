import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin') {} // Используется для защиты маршрутов, которые длжны требовать jwt-токен