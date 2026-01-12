import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional, IsDateString } from 'class-validator';

export class CreateTituloDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del título es obligatorio' })
  nombre_titulo: string;

  @IsString()
  @IsOptional()
  universidad_emisora?: string;

  @IsDateString({}, { message: 'La fecha debe ser una cadena válida en formato ISO (YYYY-MM-DD)' })
  @IsOptional()
  fecha_obtencion?: string;

  // Clave foránea: ID del profesor al que pertenece el título
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del profesor es obligatorio' })
  id_profesor: number;
}