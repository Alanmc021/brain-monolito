// services/chat.service.ts
import { Injectable } from '@nestjs/common';
import { createGirlfriendAgent } from '../amora.agent';
import { narrators } from '../narrators/narrator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessageHistory, BufferMemory } from 'langchain/memory';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { AmoraMemory } from '../schema/amora-memory.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('AmoraMemory') private readonly memoryModel: Model<AmoraMemory>,
  ) {}

  async talkToGirlfriend(userId: string, girlfriendId: string, message: string): Promise<string> {
    const profile = narrators.find(g => g.id === girlfriendId);
    if (!profile) return 'Mestre não encontrado.';

    const memory = await this.getMemoryForUser(userId, girlfriendId);
    const agent = await createGirlfriendAgent(profile, memory);

    const response = await agent.call({ input: message });

    await this.saveMemory(userId, girlfriendId, memory);
    return response.output;
  }

  private async getMemoryForUser(userId: string, girlfriendId: string): Promise<BufferMemory> {
    const memoryData = await this.memoryModel.findOne({ userId, girlfriendId }).exec();
    const chatHistory = new ChatMessageHistory();

    if (memoryData?.history) {
      for (const message of memoryData.history) {
        const MessageClass =
          message.type === 'human' ? HumanMessage :
          message.type === 'ai' ? AIMessage :
          SystemMessage;

        chatHistory.addMessage(new MessageClass({ content: message.content }));
      }
    }

    return new BufferMemory({
      memoryKey: 'history',
      returnMessages: true,
      chatHistory,
      outputKey: 'output',
    });
  }

  private async saveMemory(userId: string, girlfriendId: string, memory: BufferMemory): Promise<void> {
    const messages = await memory.chatHistory.getMessages();
    const storableHistory = messages.map(msg => ({
      type: msg._getType() as 'human' | 'ai' | 'system',
      content: msg.content.toString(),
    }));

    await this.memoryModel.findOneAndUpdate(
      { userId, girlfriendId },
      {
        userId,
        girlfriendId,
        history: storableHistory,
        updatedAt: new Date(),
      },
      { upsert: true }
    );
  }

  async getUserHistory(userId: string, girlfriendId: string) {
    const memoryData = await this.memoryModel.findOne({ userId, girlfriendId }).exec();
    return memoryData?.history || [];
  }
}
