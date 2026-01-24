// src/carreras/carreras.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCarrerasService } from 'src/prisma/prisma-carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaCarrerasService) {}

  // ... (CRUD Básico existente) ...
  create(dto: CreateCarreraDto) { return this.prisma.carrera.create({ data: dto }); }
  findAll() { return this.prisma.carrera.findMany(); }
  async findOne(id: number) {
      const c = await this.prisma.carrera.findUnique({ where: { id_carrera: id }});
      if(!c) throw new NotFoundException('Carrera no encontrada');
      return c;
  }
  update(id: number, dto: UpdateCarreraDto) { return this.prisma.carrera.update({ where: {id_carrera: id}, data: dto}); }
  remove(id: number) { return this.prisma.carrera.delete({ where: {id_carrera: id}}); }

  // --- PARTE 1: Consultas Derivadas ---

  // Obtener materias asociadas a una carrera específica
  async findMateriasPorCarrera(idCarrera: number) {
    // Verificar que la carrera existe
    await this.findOne(idCarrera);

    return this.prisma.materia.findMany({
      where: {
        id_carrera: idCarrera,
      },
      orderBy: {
        nombre_materia: 'asc',
      },
    });
  }
}