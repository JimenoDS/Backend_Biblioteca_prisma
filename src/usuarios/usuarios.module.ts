import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <--- Verificar import

@Module({
  imports: [PrismaModule], // <--- Verificar que esté aquí
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Útil si usas UsuariosService en Auth
})
export class UsuariosModule {}