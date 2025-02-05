import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateSupportRequestDto } from './dto/chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestDoc}  from './schemas/support-request.schema'
import { Model } from 'mongoose';
import { title } from 'process';

@Injectable()
export class SupportRequestClientService {
    constructor(
    @InjectModel(SupportRequest.name) private modelSupportRequest: Model<SupportRequestDoc>,
    private jwtService: JwtService
) {}     

    async createSupportRequest (data: CreateSupportRequestDto, access_token: string) {
        const decodedUser = this.jwtService.verify(access_token);
        const {id, role, name } = decodedUser;

        const newSupportRequest = {
            user: id,
            title: data.title,
            messages: [{
                author: id,
                role,
                name,
                text: data.text
            }]
        }

        return (await this.modelSupportRequest.create(newSupportRequest)).save()
  
    }

    async findSupportRequestsClient(access_token: string) {
        const decodedUser = this.jwtService.verify(access_token);
        const userId = decodedUser.id;

        return (await this.modelSupportRequest.find()).filter(el => el.user === userId && el.isActive);
    }

    async markMessagesAsRead(id: string) {
        // Проверяем, существует ли документ с указанным ID
        const findedRequestClient = await this.modelSupportRequest.findById(id);
        if (!findedRequestClient) {
            console.log(`Обращение с ID ${id} не найдено.`);
            return;
        }
    
        // Обновляем сообщения, которые соответствуют условиям
        const result = await this.modelSupportRequest.updateOne(
            { _id: id }, // Находим документ по ID
            { $set: { "messages.$[elem].readAt": new Date() } }, // Обновляем поле readAt
            {
                arrayFilters: [
                    { "elem.role": { $ne: "client" }, "elem.readAt": null } // Условия для элементов массива
                ]
            }
        );
    
        if (result.modifiedCount > 0) {
            console.log(`Сообщения в обращении с ID ${id} обновлены.`);
        } else {
            console.log(`Нет сообщений для обновления в обращении с ID ${id}.`);
        }
    }

    async getUnreadCount(id: string) {
        const findedRequestClient = await this.modelSupportRequest.findById(id);
        if (!findedRequestClient) {
            console.log(`Обращение с ID ${id} не найдено.`);
            return 0;
        }
    
        // Фильтруем сообщения, отправленные сотрудниками поддержки и не отмеченные как прочитанные
        const unreadMessages = findedRequestClient.messages.filter(
            (message) => message.role !== 'client' && message.readAt === null
        );
        console.log(unreadMessages.length);
        return unreadMessages.length;
    }

}

