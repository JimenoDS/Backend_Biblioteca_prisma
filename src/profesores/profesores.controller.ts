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

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  // --- NUEVO: PARTE 1 (Docentes con más de una materia) ---
  @Get('reporte/multi-materia')
  findMultiMateria() {
    return this.profesoresService.findDocentesMultiMateria();
  }

  // --- NUEVO: PARTE 2 (Filtros Lógicos OR/AND) ---
  @Get('reporte/logico')
  findLogicos() {
    return this.profesoresService.findDocentesLogicos();
  }

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