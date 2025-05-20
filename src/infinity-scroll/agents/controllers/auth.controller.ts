import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { MongoUserService } from '../services/mongo.user.service';
import { AuthGuard } from '@nestjs/passport'; // Para proteger os endpoints
// import { Public } from '../strategy/public.decorator';

@Controller('auth')
export class authController {
  constructor(private readonly mongoUserService: MongoUserService) { }

  // Novo endpoint público: verificar se email existe
  // @Public()
  @Post('check-email')
  async checkEmail(@Body() body: { email: string }) {
    return this.mongoUserService.checkEmailExists(body.email);
  }
  // @Public()
  @Post('register/google')
  async registerGoogle(@Body() body: { sub: string; email: string; password?: string }) {
    return this.mongoUserService.createUserGoogle(body.sub, body.email, body.password);
  }

  // Endpoint público: criar um novo usuário
  // @Public()
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.mongoUserService.createUser(body.email, body.password);
  }

  // Endpoint público: login do usuário
  // Endpoint público: criar um novo usuário
  // @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.mongoUserService.authenticateUser(body.email, body.password);
  }

  // Endpoint protegido: pegar todos os usuários
  // @UseGuards(AuthGuard('jwt')) // Protege esse endpoint
  @Get('users')
  async getAllUsers() {
    return this.mongoUserService.getAllUsers();
  }

  // Endpoint protegido: pegar um usuário por ID
  // @UseGuards(AuthGuard('jwt')) // Protege esse endpoint
  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    return this.mongoUserService.getUserById(id);
  }

  // Endpoint protegido: atualizar um usuário
  // @UseGuards(AuthGuard('jwt')) // Protege esse endpoint
  @Post('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { email: string; password: string },
  ) {
    return this.mongoUserService.updateUser(id, body.email, body.password);
  }

  // Endpoint protegido: excluir um usuário
  @UseGuards(AuthGuard('jwt')) // Protege esse endpoint
  @Post('delete/:id')
  async deleteUser(@Param('id') id: string) {
    return this.mongoUserService.deleteUser(id);
  }

  
  // RECUPERACAO DE SENHA // RECUPERACAO DE SENHA 
  // @Public()
  // @Post('request-password')
  // async requestPasswordReset(@Body() body: { email: string }) {
  //   return this.mongoUserService.requestPasswordReset(body.email);
  // }

  // // @Public()
  // @Post('reset-password')
  // async resetPassword(@Body() body: { token: string; newPassword: string }) {
  //   return this.mongoUserService.resetPassword(body.token, body.newPassword);
  // }
}
