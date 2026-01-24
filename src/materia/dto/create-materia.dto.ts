import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty()
  nombre_materia: string;

  @IsInt()
  @Min(1)
  creditos: number;

  @IsInt()
  @IsNotEmpty()
  id_carrera: number;

  // --- NUEVO CAMPO ---
  @IsOptional()
  @IsInt()
  @Min(0)
  cupos_disponibles?: number;
}