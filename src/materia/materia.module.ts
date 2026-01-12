import { Module } from '@nestjs/common';
import { MateriasService } from './materia.service';
import { MateriasController } from './materia.controller';

@Module({
  controllers: [MateriasController],
  providers: [MateriasService],
})
export class MateriaModule {}
