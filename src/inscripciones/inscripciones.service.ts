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

  // --- PARTE 4: Transacción de Matrícula (Saga Pattern) ---
  async matricularEstudiante(dto: CreateInscripcioneDto) {
    const { id_estudiante, id_materia, id_ciclo } = dto;

    // ===============================================================
    // PASO 1: VALIDACIONES PREVIAS (Para evitar fallos innecesarios)
    // ===============================================================

    // 1. Verificar que el estudiante exista y esté ACTIVO
    const estudiante = await this.prismaUsuarios.usuario.findUnique({ 
      where: { id_usuario: id_estudiante } 
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    if (!estudiante.activo) throw new BadRequestException('El estudiante no está ACTIVO y no puede matricularse.');

    // 2. Verificar que la materia exista y tenga CUPOS
    const materia = await this.prismaCarreras.materia.findUnique({ 
      where: { id_materia } 
    });
    if (!materia) throw new NotFoundException('Materia no encontrada');
    if (materia.cupos_disponibles <= 0) {
      throw new ConflictException('No hay cupos disponibles en esta materia.');
    }

    // ===============================================================
    // PASO 2: EJECUCIÓN DE LA TRANSACCIÓN DISTRIBUIDA
    // ===============================================================
    
    let inscripcionCreada = null;

    try {
      // A) OPERACIÓN 1: Registrar la matrícula (BD Usuarios)
      inscripcionCreada = await this.prismaUsuarios.inscripcion.create({
        data: {
          id_usuario: id_estudiante,
          id_materia,
          id_ciclo,
        }
      });

      // B) OPERACIÓN 2: Descontar el cupo (BD Carreras)
      await this.prismaCarreras.materia.update({
        where: { id_materia },
        data: {
          cupos_disponibles: { decrement: 1 }
        }
      });

      // SI LLEGAMOS AQUÍ, TODO SALIÓ BIEN (COMMIT IMPLÍCITO)
      return {
        status: 'success',
        mensaje: 'Matrícula realizada exitosamente',
        inscripcion: inscripcionCreada,
        cupos_restantes: materia.cupos_disponibles - 1
      };

    } catch (error) {
      // ===============================================================
      // ROLLBACK MANUAL (COMPENSACIÓN)
      // ===============================================================
      console.error('Error durante la matrícula. Iniciando rollback...', error);

      // Si se creó la inscripción pero falló la actualización de cupos...
      if (inscripcionCreada) {
        // ... BORRAMOS la inscripción para volver al estado original.
        await this.prismaUsuarios.inscripcion.delete({
          where: { id_inscripcion: inscripcionCreada.id_inscripcion }
        });
        console.log('Rollback completado: Inscripción eliminada.');
      }

      // Reenviamos el error original para que Postman lo vea
      throw new InternalServerErrorException('Error en la transacción. Se han revertido los cambios.');
    }
  }

  // --- Otros Métodos (Lectura del Paso 4 anterior) ---
  
  async findInscripcionesPorEstudianteYCiclo(idUsuario: number, idCiclo: number) {
    const inscripciones = await this.prismaUsuarios.inscripcion.findMany({
      where: { id_usuario: idUsuario, id_ciclo: idCiclo }
    });
    if (!inscripciones.length) return [];
    
    const materiaIds = inscripciones.map(i => i.id_materia);
    const materias = await this.prismaCarreras.materia.findMany({
      where: { id_materia: { in: materiaIds } }
    });

    return inscripciones.map(inscripcion => {
      const infoMateria = materias.find(m => m.id_materia === inscripcion.id_materia);
      return {
        ...inscripcion,
        nombre_materia: infoMateria ? infoMateria.nombre_materia : 'Desconocida',
        creditos: infoMateria ? infoMateria.creditos : 0
      };
    });
  }

  // Métodos CRUD básicos requeridos por la interfaz
  async create(dto: CreateInscripcioneDto) { return this.matricularEstudiante(dto); }
  async findAll() { return this.prismaUsuarios.inscripcion.findMany(); }
  async findOne(id: number) { return this.prismaUsuarios.inscripcion.findUnique({ where: { id_inscripcion: id } }); }
  async update(id: number, dto: UpdateInscripcioneDto) { return this.prismaUsuarios.inscripcion.update({ where: { id_inscripcion: id }, data: dto as any }); }
  async remove(id: number) { return this.prismaUsuarios.inscripcion.delete({ where: { id_inscripcion: id } }); }
}