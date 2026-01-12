import { IsInt, IsNotEmpty, IsPositive, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateInscripcioneDto {
  // El servicio espera 'id_estudiante' y lo mapea internamente a 'id_usuario'
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del estudiante es obligatorio' })
  id_estudiante: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID de la materia es obligatorio' })
  id_materia: number;

  // NUEVO: Campo obligatorio para cumplir con la relación de la tabla Ciclo
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del ciclo es obligatorio' })
  id_ciclo: number;

  // Opcional: Para registrar la nota final directamente
  @IsOptional()
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  calificacion_final?: number;

  // Opcional: Se mantiene por compatibilidad hacia atrás, pero el servicio lo ignora
  @IsOptional()
  @IsString()
  semestre?: string;
}