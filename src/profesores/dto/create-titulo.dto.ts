import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateTituloDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del título es obligatorio' })
  nombre_titulo: string;

  @IsString()
  @IsOptional()
  universidad_emisora?: string;


  @IsDateString({}, { message: 'La fecha debe ser una cadena válida en formato ISO' })
  @IsOptional()
  fecha_obtencion?: string;
}