import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaUsuariosService,
    private readonly prismaCarreras: PrismaCarrerasService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
      const rolEstudianteId = 2; 

      return await this.prisma.usuario.create({
        data: {
          nombres: createUsuarioDto.nombres,
          apellidos: createUsuarioDto.apellidos,
          cedula: createUsuarioDto.cedula,
          email: createUsuarioDto.email,
          password: hashedPassword,
          fecha_nacimiento: createUsuarioDto.fecha_nacimiento
            ? new Date(createUsuarioDto.fecha_nacimiento)
            : null,
          id_rol: createUsuarioDto.id_rol || rolEstudianteId,
          id_carrera: (createUsuarioDto as any).id_carrera || null,
          activo: true
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new BadRequestException('La cédula o el email ya están registrados.');
      }
      throw err;
    }
  }

  // --- AQUÍ ESTABA EL FALTANTE: findAll ---
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        orderBy: { id_usuario: 'asc' },
        include: { rol: true }, 
      }),
      this.prisma.usuario.count(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: { rol: true, inscripciones: true },
    });
    if (!usuario) throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    
    const dataToUpdate: any = { ...updateUsuarioDto };
    if (updateUsuarioDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }
    if (updateUsuarioDto.fecha_nacimiento) {
      dataToUpdate.fecha_nacimiento = new Date(updateUsuarioDto.fecha_nacimiento);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: dataToUpdate,
      include: { rol: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }

  // --- PARTE 1: Consultas Derivadas ---
  
  async findAllActiveWithCarrera() {
    const usuarios = await this.prisma.usuario.findMany({
      where: { 
        activo: true,
        rol: { nombre_rol: 'Estudiante' }
      },
    });

    const carrerasIds = [...new Set(usuarios.map(u => u.id_carrera).filter(id => id !== null))];

    const carreras = await this.prismaCarreras.carrera.findMany({
      where: { id_carrera: { in: carrerasIds as number[] } },
    });

    return usuarios.map(usuario => {
      const carreraInfo = carreras.find(c => c.id_carrera === usuario.id_carrera);
      return {
        ...usuario,
        carrera_nombre: carreraInfo ? carreraInfo.nombre_carrera : 'Sin Asignar',
      };
    });
  }

  // --- PARTE 2: Operaciones Lógicas ---

  async findEstudiantesLogicos(idCarrera: number, idCiclo: number) {
    return this.prisma.usuario.findMany({
      where: {
        AND: [
          { activo: true },
          { id_carrera: idCarrera },
          {                                  
            inscripciones: {                 
              some: {
                id_ciclo: idCiclo
              }
            }
          }
        ]
      },
      include: {
        inscripciones: {
          where: { id_ciclo: idCiclo } 
        }
      }
    });
  }

  // --- PARTE 3: Consulta Nativa SQL ---
  async reporteEstudiantesMaterias() {
    const reporteRaw: any[] = await this.prisma.$queryRaw`
      SELECT 
        u.nombres, 
        u.apellidos, 
        u.id_carrera, 
        COUNT(i.id_inscripcion)::int as "total_materias"
      FROM usuarios u
      LEFT JOIN inscripciones i ON u.id_usuario = i.id_usuario
      GROUP BY u.id_usuario, u.nombres, u.apellidos, u.id_carrera
      ORDER BY "total_materias" DESC;
    `;

    const carreraIds = [...new Set(reporteRaw.map(r => r.id_carrera).filter(id => id != null))];
    
    const carreras = await this.prismaCarreras.carrera.findMany({
      where: { id_carrera: { in: carreraIds as number[] } }
    });

    return reporteRaw.map(fila => {
      const carrera = carreras.find(c => c.id_carrera === fila.id_carrera);
      return {
        estudiante: `${fila.nombres} ${fila.apellidos}`,
        carrera: carrera ? carrera.nombre_carrera : 'Sin Carrera',
        total_materias: fila.total_materias
      };
    });
  }
}