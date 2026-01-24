import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';
import { PrismaProfesoresService } from 'src/prisma/prisma-profesores.service';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaProfesoresService) {}

  async create(createProfesorDto: CreateProfesorDto) {
    // Separamos los datos del profesor de sus relaciones para evitar errores
    // materias_asignadas se extrae pero no se guarda aquí porque requiere lógica cross-db
    const { titulos, materias_asignadas, ...profesorData } = createProfesorDto;

    return this.prisma.profesor.create({
      data: {
        ...profesorData,
        titulos: {
          create: titulos, // Prisma maneja la creación anidada de títulos
        },
      },
      include: {
        titulos: true,
      },
    });
  }

  async findAll() {
    return this.prisma.profesor.findMany({
      include: { titulos: true },
    });
  }

  async findOne(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id_profesor: id },
      include: { titulos: true, materias_asignadas: true },
    });
    if (!profesor) throw new NotFoundException(`Profesor con ID #${id} no encontrado`);
    return profesor;
  }

  async update(id: number, updateProfesorDto: UpdateProfesoreDto) {
    await this.findOne(id); // Verificamos que exista
    
    // --- CORRECCIÓN DEL ERROR ---
    // Extraemos 'titulos' y 'materias_asignadas' del objeto DTO.
    // La variable 'data' se queda SOLO con los campos planos (nombres, cedula, etc.)
    // que Prisma sí puede actualizar directamente.
    const { titulos, materias_asignadas, ...data } = updateProfesorDto;

    return this.prisma.profesor.update({
      where: { id_profesor: id },
      data: data, // Aquí ya no va 'materias_asignadas', por lo que el error desaparece
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.profesor.delete({
      where: { id_profesor: id },
    });
  }

  // ==========================================
  // PARTE 1: Consultas Derivadas
  // ==========================================

  // Listar docentes que imparten más de una asignatura
  async findDocentesMultiMateria() {
    // 1. Usamos groupBy para contar cuántas materias tiene cada profe
    const agrupados = await this.prisma.profesorMateria.groupBy({
      by: ['id_profesor'],
      _count: {
        id_materia: true,
      },
      having: {
        id_materia: {
          _count: { gt: 1 }, // "Mayor que 1"
        },
      },
    });

    // 2. Extraemos los IDs de los profesores que cumplieron la condición
    const idsProfesores = agrupados.map(g => g.id_profesor);

    // 3. Buscamos la información completa de esos profesores
    return this.prisma.profesor.findMany({
      where: {
        id_profesor: { in: idsProfesores },
      },
      include: {
        materias_asignadas: true, // Incluimos para verificar en el JSON de respuesta
      },
    });
  }

  // ==========================================
  // PARTE 2: Operaciones Lógicas
  // ==========================================

  // Filtrar docentes que:
  // (Sean de tiempo completo AND Dicten asignaturas) OR (No estén inactivos -> Activos)
  async findDocentesLogicos() {
    return this.prisma.profesor.findMany({
      where: {
        OR: [
          // CONDICIÓN A: Tiempo Completo Y Dictan algo
          {
            AND: [
              { dedicacion: 'TIEMPO_COMPLETO' },
              { materias_asignadas: { some: {} } } // some: {} valida que el array no esté vacío
            ]
          },
          // CONDICIÓN B: No inactivos (Es decir, Activos)
          {
            activo: true 
          }
        ]
      },
      include: {
        materias_asignadas: true
      }
    });
  }
}