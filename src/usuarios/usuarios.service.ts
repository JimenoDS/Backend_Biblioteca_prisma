import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service'; // <--- CAMBIO
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaUsuariosService) {} // <--- CAMBIO

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
      const rolEstudianteId = 2; 

      return await this.prisma.usuario.create({
        data: {
          nombres: createUsuarioDto.nombres,
          apellidos: createUsuarioDto.apellidos,
          cedula: createUsuarioDto.cedula,
          email: createUsuarioDto.email,
          password: hashedPassword,
          fecha_nacimiento: createUsuarioDto.fecha_nacimiento
            ? new Date(createUsuarioDto.fecha_nacimiento)
            : null,
          id_rol: createUsuarioDto.id_rol || rolEstudianteId, 
        },
      });
    } catch (err: any) { // Tipado any para acceder a code
      if (err.code === 'P2002') {
        throw new BadRequestException('La cédula o el email ya están registrados.');
      }
      throw err;
    }
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        orderBy: { id_usuario: 'asc' },
        include: { rol: true }, 
      }),
      this.prisma.usuario.count(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: { rol: true, inscripciones: true },
    });
    if (!usuario) throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    
    const dataToUpdate: any = { ...updateUsuarioDto };
    if (updateUsuarioDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }
    if (updateUsuarioDto.fecha_nacimiento) {
      dataToUpdate.fecha_nacimiento = new Date(updateUsuarioDto.fecha_nacimiento);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: dataToUpdate,
      include: { rol: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}