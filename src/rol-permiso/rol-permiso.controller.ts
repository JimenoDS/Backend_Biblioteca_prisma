import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RolPermisoService } from './rol-permiso.service';
import { CreateRolPermisoDto } from './dto/create-rol-permiso.dto';

@Controller('rol-permiso')
export class RolPermisoController {
  constructor(private readonly rolPermisoService: RolPermisoService) {}

  @Post()
  create(@Body() createRolPermisoDto: CreateRolPermisoDto) {
    return this.rolPermisoService.create(createRolPermisoDto);
  }

  @Get()
  findAll() {
    return this.rolPermisoService.findAll();
  }

  // DELETE especial para borrar usando la clave compuesta
  // Uso: DELETE http://localhost:3000/rol-permiso/1/2
  @Delete(':id_rol/:id_permiso')
  remove(
    @Param('id_rol', ParseIntPipe) id_rol: number,
    @Param('id_permiso', ParseIntPipe) id_permiso: number,
  ) {
    return this.rolPermisoService.remove(id_rol, id_permiso);
  }
}