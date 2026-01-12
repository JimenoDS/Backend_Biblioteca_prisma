import { Module } from '@nestjs/common';
import { RolPermisoService } from './rol-permiso.service';
import { RolPermisoController } from './rol-permiso.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolPermisoController],
  providers: [RolPermisoService],
})
export class RolPermisoModule {}