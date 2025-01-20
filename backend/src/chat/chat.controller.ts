import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetChatListParams, SendMessageDto } from './dto/chat.dto';
import { SupportRequestService } from './supportRequest.service';
import { SupportRequestClientService } from './supportRequestClient.service';
import { SupportRequestEmployee } from './supportRequestEmployee.service';

@Controller('common')
export class ChatController {
    constructor (
        private readonly supportRequestService: SupportRequestService,
        private readonly supportRequestClientService: SupportRequestClientService,
        private readonly supportRequestEmployee: SupportRequestEmployee,
    ) {}

    @Post('/support-requests/:id/messages')
    async sendMessage(@Body() data: SendMessageDto, @Param('id') id: string) {
        return this.supportRequestService.sendMessage(data, id)
    }

    @Get('/client-mark-read/:id') 
        async clientMarkMessagesAsRead(@Param('id') id: string) {
            this.supportRequestClientService.markMessagesAsRead(id);
        }

    @Get('/manager-mark-read/:id') 
        async managerMarkMessagesAsRead(@Param('id') id: string) {
            this.supportRequestEmployee.markMessagesAsRead(id);
        }

    @Get('unread-count-client/:id')
    async clientGetUnreadCount(@Param('id') id: string) {
        this.supportRequestClientService.getUnreadCount(id);
    }

    @Get('unread-count-manager/:id')
    async managerGetUnreadCount(@Param('id') id: string) {
        this.supportRequestEmployee.getUnreadCount(id);
    }

    @Get('/support-requests/manager') 
    async findSupportRequestsManager(@Body() params: GetChatListParams) {
        return this.supportRequestService.getSupportRequests(params);
    }

    @Get('support-requests/getMessages/:id') 
    async getMessages(@Param('id') id: string) {
        return this.supportRequestService.getMessages(id);
    }

    @Get('support-requests/close/:id')
    async closeRequest(@Param('id') id:string) {
        this.supportRequestEmployee.closeRequest(id);
        console.log(`Обращение ${id} закрыто`)
    }



    
    
}
