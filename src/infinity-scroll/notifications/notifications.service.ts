import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private tokens: Map<string, string> = new Map();

  saveToken(userId: string, token: string) {
    this.tokens.set(userId, token);
    return { message: 'Token salvo com sucesso' };
  }

  async sendPush(userId: string, title: string, body: string, data?: any) {
    const token = this.tokens.get(userId);
    if (!token) throw new Error('Token não encontrado');

    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data,
    };

    await axios.post('https://exp.host/--/api/v2/push/send', message, {
      headers: { 'Content-Type': 'application/json' },
    });

    return { message: 'Notificação enviada com sucesso' };
  }
}
