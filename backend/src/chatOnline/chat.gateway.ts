import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() { senderName, message }: { senderName: string; message: string }
    ) {
        console.log(`Сообщение от ${senderName}: ${message}`);
        this.server.emit('message', { senderName, message });
    }
}