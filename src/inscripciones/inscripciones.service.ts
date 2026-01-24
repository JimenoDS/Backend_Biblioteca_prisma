import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { PrismaUsuariosService } from 'src/prisma/prisma-usuarios.service';
import { PrismaCarrerasService } from 'src/prisma/prisma-carreras.service';

@Injectable()
export class InscripcionesService {
  constructor(
    private prismaUsuarios: PrismaUsuariosService,
    private prismaCarreras: PrismaCarrerasService,
  ) {}

  // --- PARTE 4: Operación Transaccional (Saga ACID) ---
  async matricularEstudiante(dto: CreateInscripcioneDto) {
    const { id_estudiante, id_materia, id_ciclo } = dto;

    // 1. VERIFICACIONES DE CONSISTENCIA (Reads)
    
    // A) Verificar Estudiante Activo (DB Usuarios)
    const estudiante = await this.prismaUsuarios.usuario.findUnique({ 
      where: { id_usuario: id_estudiante } 
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    if (!estudiante.activo) throw new BadRequestException('El estudiante no está ACTIVO y no puede matricularse.');

    // B) Verificar Materia y Cupos (DB Carreras)
    const materia = await this.prismaCarreras.materia.findUnique({ 
      where: { id_materia } 
    });
    if (!materia) throw new NotFoundException('Materia no encontrada');
    if (materia.cupos_disponibles <= 0) {
      throw new ConflictException('No hay cupos disponibles en esta materia.');
    }

    // 2. EJECUCIÓN TRANSACCIONAL
    // Como son BDs distintas, hacemos una "Saga": Paso 1 -> Paso 2 -> Si falla Paso 2, deshacer Paso 1.
    
    let inscripcionCreada = null;

    try {
      // PASO 1 (Atomicidad): Registrar Matrícula
      inscripcionCreada = await this.prismaUsuarios.inscripcion.create({
        data: {
          id_usuario: id_estudiante,
          id_materia,
          id_ciclo,
          // calificacion_final: null // Inicialmente sin nota
        }
      });

      // PASO 2 (Atomicidad): Descontar Cupo
      await this.prismaCarreras.materia.update({
        where: { id_materia },
        data: {
          cupos_disponibles: { decrement: 1 }
        }
      });

      // ÉXITO (Commit implícito)
      return {
        status: 'success',
        mensaje: 'Matrícula realizada exitosamente',
        inscripcion: inscripcionCreada,
        cupos_restantes: materia.cupos_disponibles - 1
      };

    } catch (error) {
      // --- ROLLBACK MANUAL (Durabilidad / Consistencia) ---
      console.error('Error durante la matrícula. Iniciando rollback...', error);

      if (inscripcionCreada) {
        // Si la inscripción se creó pero falló el descuento de cupos, la borramos
        await this.prismaUsuarios.inscripcion.delete({
          where: { id_inscripcion: inscripcionCreada.id_inscripcion }
        });
        console.log('Rollback completado: Inscripción eliminada para mantener consistencia.');
      }

      // Re-lanzamos el error para que el cliente sepa qué pasó
      if (error instanceof ConflictException || error instanceof BadRequestException) {
          throw error;
      }
      throw new InternalServerErrorException('Error procesando la matrícula. Se ha revertido la operación.');
    }
  }

  // --- CRUD BÁSICO y OTRAS CONSULTAS ---

  async create(dto: CreateInscripcioneDto) {
    // Este método queda como fallback simple, pero preferimos usar matricularEstudiante
    return this.matricularEstudiante(dto);
  }

  async findAll() {
    return this.prismaUsuarios.inscripcion.findMany({
      include: { usuario: true },
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.prismaUsuarios.inscripcion.findUnique({
      where: { id_inscripcion: id },
    });
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  async update(id: number, updateInscripcioneDto: UpdateInscripcioneDto) {
    return this.prismaUsuarios.inscripcion.update({
      where: { id_inscripcion: id },
      data: updateInscripcioneDto as any,
    });
  }

  async remove(id: number) {
    return this.prismaUsuarios.inscripcion.delete({
      where: { id_inscripcion: id },
    });
  }
}