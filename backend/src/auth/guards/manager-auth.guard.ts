import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ManagerAuthGuard extends AuthGuard('manager') {} // Используется для защиты маршрутов, которые длжны требовать jwt-токен