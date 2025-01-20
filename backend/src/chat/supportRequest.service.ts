import { SupportRequest, SupportRequestDoc } from './schemas/support-request.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetChatListParams, SendMessageDto } from './dto/chat.dto';

@Injectable()
export class SupportRequestService {
    constructor(@InjectModel(SupportRequest.name) private readonly supportRequestModel: Model<SupportRequestDoc>) { }

    async  getSupportRequests(params: GetChatListParams) { //найти обращения в тех. поддержку по id пользователя в статусе active, или только все обращения в статусе active
        const query: any = { isActive: params.isActive };
    
        if (params.user) {
            query.user = params.user;
        }
    
        return await this.supportRequestModel.find(query);
    }

    async sendMessage(data: SendMessageDto, id: string) { // отправить сообщение в созданное обращение
        const { author, role, name, text } = data;

        return this.supportRequestModel.findByIdAndUpdate(id, {
            $push: {
                messages: {
                    author,
                    role,
                    name,
                    text
                }
            }
        },
            { new: true },
        );

    }

    async getMessages(id: string) {
        const dataRequest = await this.supportRequestModel.findById(id).exec();
        return dataRequest?.messages;
    }

}
