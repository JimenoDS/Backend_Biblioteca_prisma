import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreatePermisoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del permiso es obligatorio' })
  @Length(3, 50)
  nombre_permiso: string; // Ej: "Crear Usuarios"

  @IsString()
  @IsNotEmpty({ message: 'La clave del permiso es obligatoria' })
  @Length(3, 50)
  clave: string; // Ej: "CREATE_USER"
}