// import { Module } from '@nestjs/common';
 

// @Module({
//   imports: [],
//   controllers: [],
//   providers: [],
// import { Module } from '@nestjs/common';
// import { ChatService } from './agents/services/chat.service';
// import { ChatController } from './agents/controllers/chat.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AmoraMemorySchema } from './agents/schema/amora-memory.model';
// import { UserSchema } from '@app/user-management/schemas/user.schema';
// import { MemoryModule } from '@app/memory';

import { Module } from '@nestjs/common';
import { ChatService } from './infinity-scroll/agents/services/chat.service';
import { ChatController } from './infinity-scroll/agents/controllers/chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AmoraMemorySchema } from './infinity-scroll/agents/schema/amora-memory.model';
import { UserSchema } from './infinity-scroll/agents/schema/UserSchema';
// import { MemoryModule } from '@app/memory';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gamehousedmg:YzqIV0eyaHfBMZA7@cluster0.8m3wyiw.mongodb.net/'),
    
    // Configuração do Mongoose com múltiplos schemas
    MongooseModule.forFeature([
      { name: 'AmoraMemory', schema: AmoraMemorySchema },
      { name: 'User', schema: UserSchema }, // Registrando o schema User
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class AppModule { }
// })
// export class AppModule {}
