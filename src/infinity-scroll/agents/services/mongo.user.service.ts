import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schema/UserSchema'; // Importando o schema
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoUserService {
  private readonly FRONTEND_URL: any;
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {
    this.FRONTEND_URL =  process.env.FRONTEND_URL
  }

  async createUserGoogle(sub: string, email: string, password?: string): Promise<User> {
    const idConvert = new Types.ObjectId(sub)
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('Usuário já existe');
    }

    const newUser = new this.userModel({ _id: idConvert, email, password });
    return newUser.save();
  }

  // Novo método: verificar se email existe
  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    const user = await this.userModel.findOne({ email }).exec();
    return { exists: !!user };
  }

  async createUser(email: string, password: string): Promise<User> {
    const saltRounds = 10; // Número de rounds para gerar o salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new this.userModel({ email, password: hashedPassword });
    return newUser.save();
  }

  // Encontrar todos os usuários
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec(); // Retorna todos os usuários
  }

  // Encontrar um usuário pelo ID
  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec(); // Retorna o usuário com o ID
  }

  // Atualizar um usuário
  async updateUser(id: string, email: string, password: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      { email, password },
      { new: true }, // Retorna o usuário atualizado
    ).exec();
  }

  // Excluir um usuário
  async deleteUser(id: string): Promise<User | null>{
    return this.userModel.findByIdAndDelete(id).exec(); // Exclui o usuário com o ID
  }


  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null; // Usuário não encontrado
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; // Senha incorreta
    }

    return user; // Retorna o usuário autenticado
  }

  // RECUPERACAO DE SENHA   
  // async requestPasswordReset(email: string): Promise<{ message: string }> {
  //   const user = await this.userModel.findOne({ email }).exec();
  //   if (!user) {
  //     throw new NotFoundException('Usuário não encontrado');
  //   }

  //   const resetToken = crypto.randomBytes(32).toString('hex');
  //   const resetTokenExpiration = new Date();
  //   resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1); // Token válido por 1 hora

  //   user.resetPasswordToken = resetToken;
  //   user.resetPasswordExpires = resetTokenExpiration;
  //   await user.save();

  //   // Aqui você pode enviar o email contendo o link com o token (exemplo de URL)
  //   // Exemplo: https://seusite.com/reset-password?token=resetToken

  //   // ESSA FUNCAO DEVE SER LIGADO A LIB DE MENSSAGERIA 
  //   await this.sendPasswordResetEmail(email, resetToken); // Envia o e-mail   

  //   return { message: 'E-mail de recuperação enviado' };
  // }

  // async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  //   const user = await this.userModel.findOne({
  //     resetPasswordToken: token,
  //     resetPasswordExpires: { $gt: new Date() },
  //   }).exec();

  //   if (!user) {
  //     throw new NotFoundException('Token inválido ou expirado');
  //   }

  //   user.password = await bcrypt.hash(newPassword, 10);
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpires = undefined;
  //   await user.save();

  //   return { message: 'Senha redefinida com sucesso' };
  // }



  // private async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
  //   const transporter = nodemailer.createTransport({
  //     service: 'gmail', // Use 'hotmail', 'outlook', 'yahoo' se necessário   
  //     auth: {
  //       user: "amoradev3@gmail.com", // Configure no .env amoradev3@gmail.com
  //       pass: "wtcdkdbanazbawew", // Configure no .env wtcdkdbanazbawew
  //     },
  //   });

  //   const resetLink = `${this.FRONTEND_URL}/pages/reset-password?token=${resetToken}`;

  //   const mailOptions = {
  //     from: process.env.EMAIL_USER,
  //     to,
  //     subject: 'Recuperação de Senha',
  //     html: `
  //       <h1>Recuperação de Senha</h1>
  //       <p>Clique no link abaixo para redefinir sua senha:</p>
  //       <a href="${resetLink}" target="_blank">${resetLink}</a>
  //       <p>O link expira em 1 hora.</p>
  //     `,
  //   };

  //   await transporter.sendMail(mailOptions);
  // }
}
