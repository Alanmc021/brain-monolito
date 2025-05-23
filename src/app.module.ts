import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatService } from './infinity-scroll/agents/services/chat.service';
import { ChatController } from './infinity-scroll/agents/controllers/chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AmoraMemorySchema } from './infinity-scroll/agents/schema/amora-memory.model';
import { UserSchema } from './infinity-scroll/agents/schema/UserSchema';
import { authController } from './infinity-scroll/agents/controllers/auth.controller';
import { MongoUserService } from './infinity-scroll/agents/services/mongo.user.service';
// import { MemoryModule } from '@app/memory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'AmoraMemory', schema: AmoraMemorySchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ChatController , authController],
  providers: [ChatService , MongoUserService],
})
export class AppModule {}
// })
// export class AppModule {}
