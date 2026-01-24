import { Module } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <--- IMPORTANTE

@Module({
  imports: [PrismaModule], // <--- AGREGAR ESTO PARA QUE FUNCIONE EL SERVICE
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
})
export class ProfesoresModule {}