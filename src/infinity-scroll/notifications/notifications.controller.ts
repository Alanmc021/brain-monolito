// notifications.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post('token')
  saveToken(@Body() body: { userId: string; expoPushToken: string }) {
    return this.service.saveToken(body.userId, body.expoPushToken);
  }

  @Post('send')
  sendPush(@Body() body: { userId: string; title: string; body: string; data?: any }) {
    return this.service.sendPush(body.userId, body.title, body.body, body.data);
  }
}
