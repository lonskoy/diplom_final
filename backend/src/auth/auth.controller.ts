import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalStrategy } from './stretegy/local.strategy';
import { AuthService } from './auth.service'

@Controller('api/auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @UseGuards(LocalStrategy)
    @Post('login') 
    async login(@Request() req: any ) {
        console.log('Пользователь успешно вошел:', req.user);
    return this.authService.login(req.user);
    }

}
