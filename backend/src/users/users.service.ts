import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: Partial<User>): Promise<User> {
    let { passwordHash, ...otherData } = data; // 
    if (!passwordHash) {
      throw new Error('Password is required'); // Проверка, что пароль передан
    }
    const newPasswordHash = await bcrypt.hash(passwordHash, 10); // Хешируем пароль
    passwordHash = newPasswordHash
    const newData = { ...otherData, passwordHash }; // Объединяем остальные данные и хеш пароля

    const newUser = new this.userModel(newData); 
    return newUser.save(); // 
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}