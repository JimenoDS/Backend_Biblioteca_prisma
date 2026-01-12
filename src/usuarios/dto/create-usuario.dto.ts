import { IsString, IsEmail, Length, IsOptional, IsDateString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 10)
  cedula: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50, { message: 'La contraseña debe tener entre 6 y 50 caracteres' })
  password: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  // Nuevo campo para el Rol (opcional porque en el servicio le pusimos un default)
  @IsInt()
  @IsOptional()
  id_rol?: number;
}