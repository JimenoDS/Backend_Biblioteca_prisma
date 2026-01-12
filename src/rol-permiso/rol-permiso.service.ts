import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateRolPermisoDto } from './dto/create-rol-permiso.dto';
// Importamos el servicio de Usuarios
import { PrismaUsuariosService } from 'src/prisma/prisma-usuarios.service';
import { Prisma } from '@prisma/client-usuarios'; // Nota: Importamos el tipo de error del cliente específico

@Injectable()
export class RolPermisoService {
  constructor(private prisma: PrismaUsuariosService) {} // <--- Inyección correcta

  // ASIGNAR PERMISO A ROL
  async create(dto: CreateRolPermisoDto) {
    try {
      return await this.prisma.rolPermiso.create({
        data: {
          id_rol: dto.id_rol,
          id_permiso: dto.id_permiso,
        },
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Este rol ya tiene asignado este permiso.');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('El Rol o el Permiso no existen.');
        }
      }
      throw error;
    }
  }

  // LISTAR TODOS
  async findAll() {
    return this.prisma.rolPermiso.findMany({
      include: {
        rol: true,
        permiso: true,
      },
    });
  }

  // ELIMINAR
  async remove(id_rol: number, id_permiso: number) {
    try {
      return await this.prisma.rolPermiso.delete({
        where: {
          id_rol_id_permiso: {
            id_rol: id_rol,
            id_permiso: id_permiso,
          },
        },
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('No se encontró esa asignación para eliminar.');
      }
      throw error;
    }
  }
}