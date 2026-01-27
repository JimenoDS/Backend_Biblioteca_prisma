import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  // --- PARTE 4: Endpoint Transaccional ---
  @Post('matricular')
  matricular(@Body() createInscripcioneDto: CreateInscripcioneDto) {
    return this.inscripcionesService.matricularEstudiante(createInscripcioneDto);
  }
  // ---------------------------------------

  @Get('estudiante/:idUsuario/ciclo/:idCiclo')
  findByEstudianteAndCiclo(
    @Param('idUsuario') idUsuario: string,
    @Param('idCiclo') idCiclo: string,
  ) {
    return this.inscripcionesService.findInscripcionesPorEstudianteYCiclo(+idUsuario, +idCiclo);
  }

  @Post()
  create(@Body() createInscripcioneDto: CreateInscripcioneDto) {
    return this.inscripcionesService.create(createInscripcioneDto);
  }

  @Get()
  findAll() { return this.inscripcionesService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.inscripcionesService.findOne(+id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInscripcioneDto: UpdateInscripcioneDto) {
    return this.inscripcionesService.update(+id, updateInscripcioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.inscripcionesService.remove(+id); }
}