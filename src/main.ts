import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir chamadas do seu front-end
  app.enableCors({
    origin: 'http://localhost:8082', // ou '*' em desenvolvimento
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT ?? 7086;
  await app.listen(port);
  console.log(`🚀 Server rodando em http://localhost:${port}`);
}
bootstrap();
