import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la materia es obligatorio' })
  nombre_materia: string;

  @IsInt()
  @IsPositive()
  creditos: number;

  // Clave foránea para la Carrera
  @IsInt()
  @IsPositive()
  id_carrera: number;

  
}