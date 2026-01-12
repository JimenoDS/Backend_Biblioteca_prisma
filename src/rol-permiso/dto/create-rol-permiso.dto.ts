import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateRolPermisoDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del Rol es obligatorio' })
  id_rol: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del Permiso es obligatorio' })
  id_permiso: number;
}