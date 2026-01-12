import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
  @Length(3, 50, { message: 'El nombre del rol debe tener entre 3 y 50 caracteres' })
  nombre_rol: string; // Ej: "Administrador", "Estudiante"
}