// src/controllers/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
// import { Public } from '../../strategy/public.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // @Public()
  @Post()
  async talkToGirlfriend(
    @Body() body: {userId:string,  masterID: string; message: string },
  ): Promise<{ response: string }> {
    const { userId, masterID, message } = body;
    const response = await this.chatService.talkToGirlfriend(userId ,masterID, message);
    return { response };
  }

  // @Public()
  @Post('history')
  async getHistory(@Body() body: { userId: string; masterID: string }) {
    const { userId, masterID } = body;
    const history = await this.chatService.getUserHistory(userId, masterID);
    return { history };
  }
}
