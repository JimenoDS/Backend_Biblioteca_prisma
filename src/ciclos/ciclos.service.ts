import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
// Importamos el servicio específico de Carreras
import { PrismaCarrerasService } from 'src/prisma/prisma-carreras.service';

@Injectable()
export class CiclosService {
  
  constructor(private prisma: PrismaCarrerasService) {}

  // Crear
  async create(createCicloDto: CreateCicloDto) {
    return this.prisma.ciclo.create({
      data: {
        nombre_ciclo: createCicloDto.nombre_ciclo,
        // Convertimos string a Date si vienen definidos
        fecha_inicio: createCicloDto.fecha_inicio ? new Date(createCicloDto.fecha_inicio) : null,
        fecha_fin: createCicloDto.fecha_fin ? new Date(createCicloDto.fecha_fin) : null,
      }
    });
  }

  // Buscar Todos
  async findAll() {
    return this.prisma.ciclo.findMany();
  }

  // Buscar Uno
  async findOne(id: number) {
    const ciclo = await this.prisma.ciclo.findUnique({
      where: { id_ciclo: id },
    });
    if (!ciclo) throw new NotFoundException(`Ciclo con ID ${id} no encontrado`);
    return ciclo;
  }

  // Actualizar
  async update(id: number, updateCicloDto: UpdateCicloDto) {
    await this.findOne(id); // Verificar existencia
    
    // Transformamos las fechas si vienen en el DTO de actualización
    const data: any = { ...updateCicloDto };
    if (updateCicloDto.fecha_inicio) data.fecha_inicio = new Date(updateCicloDto.fecha_inicio);
    if (updateCicloDto.fecha_fin) data.fecha_fin = new Date(updateCicloDto.fecha_fin);

    return this.prisma.ciclo.update({
      where: { id_ciclo: id },
      data: data,
    });
  }

  // Eliminar
  async remove(id: number) {
    await this.findOne(id); // Verificar existencia
    return this.prisma.ciclo.delete({
      where: { id_ciclo: id },
    });
  }
}