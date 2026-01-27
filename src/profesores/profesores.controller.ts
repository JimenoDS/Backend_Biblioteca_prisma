import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesoresService.create(createProfesorDto);
  }

  // ==================================================================
  // ZONA DE REPORTES Y FILTROS (DEBEN IR AQUÍ, ANTES DEL :id)
  // ==================================================================

  // 1. Docentes con más de una materia
  // URL Postman: http://localhost:3000/profesores/multi-materia
  @Get('multi-materia')
  findMultiMateria() {
    return this.profesoresService.findDocentesMultiMateria();
  }

  // 2. Filtros Lógicos
  // URL Postman: http://localhost:3000/profesores/logico
  @Get('logico')
  findLogicos() {
    return this.profesoresService.findDocentesLogicos();
  }

  // ==================================================================
  // FIN ZONA DE REPORTES
  // ==================================================================

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  // IMPORTANTE: Este @Get(':id') captura CUALQUIER COSA que no coincida arriba.
  // Por eso debe ir al final de los Gets.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfesoreDto: UpdateProfesoreDto) {
    return this.profesoresService.update(+id, updateProfesoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profesoresService.remove(+id);
  }
}