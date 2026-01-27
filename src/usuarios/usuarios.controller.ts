import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService
  ) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.usuariosService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  // --- PARTE 1: Consultas Derivadas ---
  // Listar estudiantes activos con su carrera
  @Get('activos-con-carrera')
  findActivos() {
    return this.usuariosService.findAllActiveWithCarrera();
  }

  // --- PARTE 2: Endpoint para Filtros Lógicos ---
  @Get('buscar/logico')
  findLogicos(@Query('idCarrera') idCarrera: string, @Query('idCiclo') idCiclo: string) {
    return this.usuariosService.findEstudiantesLogicos(+idCarrera, +idCiclo);
  }

  // --- PARTE 3: Endpoint para Reporte Nativo ---
  @Get('reporte/ranking-materias')
  getReporteNativo() {
    return this.usuariosService.reporteEstudiantesMaterias();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}