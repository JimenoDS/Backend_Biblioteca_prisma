import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
// Importamos el servicio específico de Usuarios
import { PrismaUsuariosService } from 'src/prisma/prisma-usuarios.service';
import { Prisma } from '@prisma/client-usuarios'; // Importamos tipos del cliente específico

@Injectable()
export class PermisosService {
  constructor(private prisma: PrismaUsuariosService) {} // Inyección corregida

  async create(createPermisoDto: CreatePermisoDto) {
    try {
      return await this.prisma.permiso.create({
        data: createPermisoDto,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe un permiso con ese nombre o clave.');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.permiso.findMany();
  }

  async findOne(id: number) {
    const permiso = await this.prisma.permiso.findUnique({
      where: { id_permiso: id },
    });
    if (!permiso) throw new NotFoundException(`Permiso con ID #${id} no encontrado`);
    return permiso;
  }

  async update(id: number, updatePermisoDto: UpdatePermisoDto) {
    await this.findOne(id); // Verificar existencia
    try {
      return await this.prisma.permiso.update({
        where: { id_permiso: id },
        data: updatePermisoDto,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe otro permiso con ese nombre o clave.');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar existencia
    return this.prisma.permiso.delete({
      where: { id_permiso: id },
    });
  }
}