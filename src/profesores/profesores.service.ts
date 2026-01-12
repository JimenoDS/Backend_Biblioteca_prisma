import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';
import { PrismaProfesoresService } from 'src/prisma/prisma-profesores.service'; // <--- CAMBIO

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaProfesoresService) {} // <--- CAMBIO

  create(createProfesorDto: CreateProfesorDto) {
    // Extraemos materias_asignadas, pero OJO: no podemos crearlas en una sola transacción
    // automáticamente si cruzan bases de datos. Por ahora, nos enfocamos en el profesor y títulos.
    const { titulos, materias_asignadas, ...profesorData } = createProfesorDto;

    return this.prisma.profesor.create({
      data: {
        ...profesorData, 
        titulos: {
          create: titulos, 
        },
      },
      include: {
        titulos: true, 
      },
    });
  }

  findAll() {
    return this.prisma.profesor.findMany({
      include: { titulos: true }, // Quitamos materias_asignadas del include por ahora
    });
  }

  async findOne(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id_profesor: id },
      include: { titulos: true }, 
    });
    if (!profesor) throw new NotFoundException(`Profesor con ID #${id} no encontrado`);
    return profesor;
  }

  async update(id: number, updateProfesorDto: UpdateProfesoreDto) {
    const { titulos, materias_asignadas, ...data } = updateProfesorDto;
    await this.findOne(id);
    
    return this.prisma.profesor.update({
        where: { id_profesor: id },
        data: data
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.profesor.delete({
      where: { id_profesor: id },
    });
  }
}