import { Module } from '@nestjs/common';
import { TitulosService } from './titulos.service';
import { TitulosController } from './titulos.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- IMPORTANTE

@Module({
  imports: [PrismaModule], // <-- IMPORTANTE
  controllers: [TitulosController],
  providers: [TitulosService],
})
export class TitulosModule {}