import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesorDto } from './create-profesore.dto';
import { CreateTituloDto } from './create-titulo.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';


export class UpdateProfesoreDto extends PartialType(CreateProfesorDto) {}

// update-profesor.dto.ts (usando class-validator)
export class UpdateProfesorDto extends PartialType(CreateProfesorDto) {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTituloDto)
  titulos?: CreateTituloDto[];
}
    