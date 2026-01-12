import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTituloDto } from './dto/create-titulo.dto';
import { UpdateTituloDto } from './dto/update-titulo.dto';
// Importamos el servicio de Profesores
import { PrismaProfesoresService } from 'src/prisma/prisma-profesores.service';

@Injectable()
export class TitulosService {
  constructor(private prisma: PrismaProfesoresService) {} // <--- Inyección correcta

  async create(createTituloDto: CreateTituloDto) {
    const { id_profesor, nombre_titulo, universidad_emisora, fecha_obtencion } = createTituloDto;

    // 1) Verificar Profesor
    const profesor = await this.prisma.profesor.findUnique({
      where: { id_profesor },
    });
    if (!profesor) {
      throw new NotFoundException(`Profesor ${id_profesor} no existe`);
    }

    // 2) Crear Título
    return await this.prisma.titulo.create({
      data: {
        nombre_titulo,
        universidad_emisora,
        fecha_obtencion: fecha_obtencion ? new Date(fecha_obtencion) : null,
        profesor: { connect: { id_profesor } },
      },
      include: { profesor: true },
    });
  }

  async findAll() {
    return this.prisma.titulo.findMany({
      include: { profesor: true },
    });
  }

  async findOne(id: number) {
    const titulo = await this.prisma.titulo.findUnique({
      where: { id_titulo: id },
      include: { profesor: true },
    });
    if (!titulo) throw new NotFoundException(`Título con ID #${id} no encontrado`);
    return titulo;
  }

  async update(id: number, updateTituloDto: UpdateTituloDto) {
    await this.findOne(id); // Verificar existencia

    const { id_profesor, ...rest } = updateTituloDto;
    const data: any = { ...rest };

    // Si hay fecha, convertirla
    if (rest.fecha_obtencion) {
        data.fecha_obtencion = new Date(rest.fecha_obtencion);
    }

    // Si cambian el profesor, conectar al nuevo
    if (id_profesor) {
      const prof = await this.prisma.profesor.findUnique({ where: { id_profesor } });
      if (!prof) throw new NotFoundException(`Profesor ${id_profesor} no existe`);
      data.profesor = { connect: { id_profesor } };
    }

    return this.prisma.titulo.update({
      where: { id_titulo: id },
      data,
      include: { profesor: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.titulo.delete({
      where: { id_titulo: id },
    });
  }
}