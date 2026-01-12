import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
// Importamos AMBOS servicios
import { PrismaUsuariosService } from 'src/prisma/prisma-usuarios.service';
import { PrismaCarrerasService } from 'src/prisma/prisma-carreras.service';

@Injectable()
export class InscripcionesService {
  constructor(
    private prismaUsuarios: PrismaUsuariosService, // Para guardar la inscripción
    private prismaCarreras: PrismaCarrerasService, // Para validar materia y ciclo
  ) {}

  async create(createInscripcioneDto: CreateInscripcioneDto) {
    const { id_estudiante, id_materia, id_ciclo, calificacion_final } = createInscripcioneDto;

    // 1. VALIDACIÓN CRUZADA: Verificar que Materia y Ciclo existan en la OTRA base de datos
    const materiaExists = await this.prismaCarreras.materia.findUnique({ where: { id_materia } });
    if (!materiaExists) throw new NotFoundException(`Materia con ID ${id_materia} no encontrada`);

    const cicloExists = await this.prismaCarreras.ciclo.findUnique({ where: { id_ciclo } });
    if (!cicloExists) throw new NotFoundException(`Ciclo con ID ${id_ciclo} no encontrado`);

    // 2. VALIDACIÓN LOCAL: Verificar Usuario
    const usuarioExists = await this.prismaUsuarios.usuario.findUnique({ where: { id_usuario: id_estudiante } });
    if (!usuarioExists) throw new NotFoundException(`Estudiante con ID ${id_estudiante} no encontrado`);

    // 3. Crear Inscripción
    try {
      return await this.prismaUsuarios.inscripcion.create({
        data: {
          id_usuario: id_estudiante,
          id_materia, // Se guarda el ID plano
          id_ciclo,   // Se guarda el ID plano
          calificacion_final,
        },
      });
    } catch (error: any) {
        // P2002 salta si hay una restricción unique compuesta (ej: usuario+materia+ciclo)
        if (error.code === 'P2002') {
          throw new ConflictException('El usuario ya está inscrito en esta materia y ciclo.');
        }
        throw error;
    }
  }

  async findAll() {
    // Al ser BDs separadas, no podemos hacer 'include: { materia: true }' directamente.
    // Aquí devolveremos solo los datos de inscripción y el usuario.
    return this.prismaUsuarios.inscripcion.findMany({
      include: {
        usuario: { select: { id_usuario: true, nombres: true, apellidos: true } },
      },
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.prismaUsuarios.inscripcion.findUnique({
      where: { id_inscripcion: id },
      include: {
        usuario: { select: { id_usuario: true, nombres: true, apellidos: true } },
      },
    });
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  async update(id: number, updateInscripcioneDto: UpdateInscripcioneDto) {
    await this.findOne(id);
    const { id_estudiante, ...data } = updateInscripcioneDto as any;
    const dataToUpdate = { ...data };
    
    if (id_estudiante) dataToUpdate.id_usuario = id_estudiante;

    return this.prismaUsuarios.inscripcion.update({
      where: { id_inscripcion: id },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prismaUsuarios.inscripcion.delete({
      where: { id_inscripcion: id },
    });
  }
}