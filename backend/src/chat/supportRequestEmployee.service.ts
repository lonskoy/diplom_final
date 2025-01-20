import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestDoc } from './schemas/support-request.schema';
import { Model } from 'mongoose';

@Injectable()
export class SupportRequestEmployee {
    constructor(@InjectModel(SupportRequest.name) private modelSupportRequest: Model<SupportRequestDoc>) {}

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
                    { "elem.role": { $ne: "manager" }, "elem.readAt": null } // Условия для элементов массива
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
            (message) => message.role !== 'manager' && message.readAt === null
        );
        console.log(unreadMessages.length);
        return unreadMessages.length;
    }

    async closeRequest(id: string) {
        return this.modelSupportRequest.findByIdAndUpdate(id, {isActive: false});
    }


} 
