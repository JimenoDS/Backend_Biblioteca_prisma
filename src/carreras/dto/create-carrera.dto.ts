import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la carrera es obligatorio' })
  nombre_carrera: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt({ message: 'La duración debe ser un número entero' })
  @IsPositive({ message: 'La duración debe ser un número positivo' })
  @IsOptional()
  duracion_semestres?: number;
}