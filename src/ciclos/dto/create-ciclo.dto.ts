import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCicloDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del ciclo es obligatorio (ej: "2025-I")' })
  nombre_ciclo: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser válida (ISO 8601)' })
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser válida (ISO 8601)' })
  fecha_fin?: string;
}