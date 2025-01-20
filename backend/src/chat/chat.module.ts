import { Module } from '@nestjs/common';
import { SupportRequestService } from './supportRequest.service';
import { SupportRequestClientService } from './supportRequestClient.service';
import { SupportRequestEmployee } from './supportRequestEmployee.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SupportRequest, SupportRequestSchema } from './schemas/support-request.schema';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: SupportRequest.name, schema: SupportRequestSchema}]),
    JwtModule.register({
      secret: 'stranaferm40', 
      signOptions: { expiresIn: '1h' }
    })
  ],
  providers: [SupportRequestService, SupportRequestClientService, SupportRequestEmployee],
  exports: [SupportRequestService, SupportRequestClientService, SupportRequestEmployee],
  controllers: [ChatController]
})

export class ChatModule {}
