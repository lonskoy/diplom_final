import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any, @Res() response: Response) {
    console.log('Авторизовался пользователь:', req.user);
    return this.authService.login(req.user, response);
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    return this.authService.logout(response);
  }
}