import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaModule } from '../prisma/prisma.module';  // 👈 importa PrismaModule

@Module({
  imports: [PrismaModule], // 👈 agrega esto
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
