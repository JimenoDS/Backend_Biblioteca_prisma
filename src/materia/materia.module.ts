import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriasController } from './materia.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <--- IMPORTANTE

@Module({
  imports: [PrismaModule], // <--- AGREGAR
  controllers: [MateriasController],
  providers: [MateriaService, ],
})
export class MateriaModule {}