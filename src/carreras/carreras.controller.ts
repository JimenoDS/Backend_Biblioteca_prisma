import {Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe,} from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
@Controller('carreras')
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}

  @Post()
 // @UseGuards(JwtAuthGuard) // Protección con JWT 
  create(@Body() createCarreraDto: CreateCarreraDto) {
    return this.carrerasService.create(createCarreraDto);
  }

  @Get()
  findAll() {
    return this.carrerasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carrerasService.findOne(id);
  }


@Patch(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCarreraDto) {
  return this.carrerasService.update(id, dto);
}


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carrerasService.remove(id);
  }
  // En src/carreras/carreras.controller.ts

@Get(':id/materias')
async findMateriasPorCarrera(@Param('id') id: string) {
  return this.carrerasService.findMateriasPorCarrera(+id);
}
}