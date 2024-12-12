import { Injectable, Param, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class IUsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
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

  @Get(':id')
  async findById(@Param() id: string): Promise<User | null> {
    return await this.userModel.findById(id)
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async checkUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
        throw new Error('Пользователь с таким email не найден');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatch) {
        throw new Error('Неверный пароль');
    }

    return user.toObject();
}

}