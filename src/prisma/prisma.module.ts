import { Module, Global } from '@nestjs/common';
import { PrismaUsuariosService } from './prisma-usuarios.service';
import { PrismaCarrerasService } from './prisma-carreras.service'; // <--- IMPORTAR
import { PrismaProfesoresService } from './prisma-profesores.service'; // <--- IMPORTAR

@Global() // <--- Importante: Esto hace que no tengas que importar PrismaModule en todos lados, pero es buena práctica tenerlo
@Module({
  providers: [
    PrismaUsuariosService, 
    PrismaCarrerasService, // <--- AGREGAR
    PrismaProfesoresService // <--- AGREGAR
  ],
  exports: [
    PrismaUsuariosService, 
    PrismaCarrerasService, // <--- AGREGAR
    PrismaProfesoresService // <--- AGREGAR
  ],
})
export class PrismaModule {}