import { Global, Module } from '@nestjs/common';
import { PrismaCarrerasService } from './prisma-carreras.service';
import { PrismaProfesoresService } from './prisma-profesores.service';
import { PrismaUsuariosService } from './prisma-usuarios.service';

@Global()
@Module({
  providers: [
    PrismaCarrerasService, 
    PrismaProfesoresService, 
    PrismaUsuariosService
  ],
  exports: [
    PrismaCarrerasService, 
    PrismaProfesoresService, 
    PrismaUsuariosService
  ],
})
export class PrismaModule {}