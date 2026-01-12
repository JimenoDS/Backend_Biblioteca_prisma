import { IsString, IsNotEmpty, IsEmail, Length, IsArray, ValidateNested, IsOptional, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTituloDto } from './create-titulo.dto'; 

export class CreateProfesorMateriaDto {
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    id_materia: number; // Clave foránea de la materia
}

// --- DTO Principal: CreateProfesorDto ---
export class CreateProfesorDto {
    @IsString()
    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    nombres: string;

    @IsString()
    @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 10, { message: 'La cédula debe tener 10 dígitos' })
    cedula: string;

    @IsEmail({}, { message: 'El formato del email no es válido' })
    @IsNotEmpty()
    email: string;

    @IsArray({ message: 'Los títulos deben ser un array' })
    @ValidateNested({ each: true })
    @Type(() => CreateTituloDto)
    titulos: CreateTituloDto[];

    @IsArray({ message: 'La asignación de materias debe ser un array' })
    @ValidateNested({ each: true })
    @Type(() => CreateProfesorMateriaDto)
    @IsOptional() 
    materias_asignadas?: CreateProfesorMateriaDto[];
}