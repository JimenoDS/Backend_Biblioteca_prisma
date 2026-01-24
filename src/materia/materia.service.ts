import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaCarrerasService } from 'src/prisma/prisma-carreras.service'; // <--- USAR ESTE SERVICIO

@Injectable()
export class MateriaService {
  constructor(private prisma: PrismaCarrerasService) {} // <--- INYECCIÓN CORRECTA

  async create(createMateriaDto: CreateMateriaDto) {
    // Verificamos que la carrera exista antes de crear la materia
    const carrera = await this.prisma.carrera.findUnique({
      where: { id_carrera: createMateriaDto.id_carrera }
    });
    
    if (!carrera) {
      throw new NotFoundException(`La carrera con ID ${createMateriaDto.id_carrera} no existe.`);
    }

    return this.prisma.materia.create({
      data: {
        nombre_materia: createMateriaDto.nombre_materia,
        creditos: createMateriaDto.creditos,
        id_carrera: createMateriaDto.id_carrera,
        cupos_disponibles: createMateriaDto.cupos_disponibles || 30 // Valor por defecto si no se envía
      },
    });
  }

  findAll() {
    return this.prisma.materia.findMany();
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id_materia: id },
    });
    if (!materia) throw new NotFoundException(`Materia #${id} no encontrada`);
    return materia;
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto) {
    await this.findOne(id);
    return this.prisma.materia.update({
      where: { id_materia: id },
      data: updateMateriaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.materia.delete({
      where: { id_materia: id },
    });
  }
}