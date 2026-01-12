import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
// Importamos el servicio específico de Carreras
import { PrismaCarrerasService } from 'src/prisma/prisma-carreras.service'; 

@Injectable()
export class MateriasService {
  // Inyectamos PrismaCarrerasService en lugar del genérico
  constructor(private prisma: PrismaCarrerasService) {}

  async create(createMateriaDto: CreateMateriaDto) {
    // Validamos que la carrera exista antes de crear la materia (integridad referencial en misma DB)
    const carreraExists = await this.prisma.carrera.findUnique({
      where: { id_carrera: createMateriaDto.id_carrera },
    });

    if (!carreraExists) {
      throw new NotFoundException(`Carrera con ID ${createMateriaDto.id_carrera} no encontrada`);
    }

    return this.prisma.materia.create({
      data: createMateriaDto,
    });
  }

  findAll() {
    return this.prisma.materia.findMany({
      include: { carrera: true }, // Relación interna, funciona perfecto
    });
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id_materia: id },
      include: { carrera: true },
    });
    if (!materia) throw new NotFoundException(`Materia ${id} no encontrada`);
    return materia;
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto) {
    // Verificar existencia
    await this.findOne(id); 

    // Si intentan cambiar la carrera, validamos que la nueva exista
    if (updateMateriaDto.id_carrera) {
       const carreraExists = await this.prisma.carrera.findUnique({
        where: { id_carrera: updateMateriaDto.id_carrera },
      });
      if (!carreraExists) {
        throw new NotFoundException(`Carrera con ID ${updateMateriaDto.id_carrera} no encontrada`);
      }
    }

    return this.prisma.materia.update({
      where: { id_materia: id },
      data: updateMateriaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar existencia
    return this.prisma.materia.delete({ where: { id_materia: id } });
  }
}