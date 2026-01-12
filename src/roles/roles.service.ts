import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
// Importamos el servicio específico de Usuarios
import { PrismaUsuariosService } from 'src/prisma/prisma-usuarios.service';
import { Prisma } from '@prisma/client-usuarios'; // Importamos tipos del cliente específico

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaUsuariosService) {} // Inyección corregida

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.prisma.rol.create({
        data: createRoleDto,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe un rol con ese nombre.');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.rol.findMany({
      include: { permisos: true } 
    });
  }

  async findOne(id: number) {
    const rol = await this.prisma.rol.findUnique({
      where: { id_rol: id },
      include: { permisos: true }
    });
    if (!rol) throw new NotFoundException(`Rol con ID #${id} no encontrado`);
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id); // Verificar existencia
    try {
      return await this.prisma.rol.update({
        where: { id_rol: id },
        data: updateRoleDto,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe un rol con ese nombre.');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar existencia
    return this.prisma.rol.delete({
      where: { id_rol: id },
    });
  }
}