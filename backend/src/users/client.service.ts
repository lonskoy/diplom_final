import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto'
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie'
import { Response } from 'express'

@Injectable()
export class ClientService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, 
  private readonly jwtServise: JwtService) {}

  async create(data: RegisterDto, response: Response) {
    let { password, ...otherData } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ ...otherData, passwordHash });
    await newUser.save();

    const access_token = this.jwtServise.sign({id: newUser._id}); // записываем _id в токен
    console.log(access_token)

    response.setHeader(                                            //устнавливаем заголовок cookie
      'Set-Cookie',
      cookie.serialize('access_token', String(access_token), {
        maxAge: 3600,
        domain: 'localhost',
        path: '/',
      }),
    );
    response.send(); // отправка
    return response.end(); // завершение сессии 
  }
}