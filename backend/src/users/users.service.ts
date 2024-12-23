import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserParams } from '../users/interfaces/searchUserParams.interface'
import { query } from 'express';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: CreateUserDto): Promise<User> {
    const { email, password, ...otherData } = data;
    const existingUser = await this.userModel.findOne({ email }); // Проверка на уникальность email
    if (existingUser) {
      throw new BadRequestException('Email уже занят');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ ...otherData, email, passwordHash });
    return newUser.save();
  }


  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(query: SearchUserParams): Promise<any> {
    const { limit, offset, email, name, contactPhone }: any = query;

    const filters: any = {}
    if(email) filters.email = { $regex: email, $options: 'i' }
    if(name) filters.name = { $regex: name, $options: 'i' }
    if(contactPhone) filters.contactPhone = { $regex: contactPhone, $options: 'i' }

    const users = this.userModel
    .find(filters)
    .skip(offset || 0)
    .limit(limit || 10)
    .exec()

    return (await users).map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    }));

  }

  async checkUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      throw new Error('Пароль не верен');
    }
    return user.toObject();
  }
}