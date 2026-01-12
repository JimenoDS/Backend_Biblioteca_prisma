import {Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe,} from '@nestjs/common';
import { TitulosService } from './titulos.service';
import { CreateTituloDto } from './dto/create-titulo.dto';
import { UpdateTituloDto } from './dto/update-titulo.dto';

@Controller('titulos')
export class TitulosController {
  constructor(private readonly titulosService: TitulosService) {}

  @Post()
  create(@Body() createTituloDto: CreateTituloDto) {
    return this.titulosService.create(createTituloDto);
  }

  @Get()
  findAll() {
    return this.titulosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.titulosService.findOne(id);
  }

 @Patch(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTituloDto) {
  return this.titulosService.update(id, dto);
}


  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.titulosService.remove(id);
  }
}