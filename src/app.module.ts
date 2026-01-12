import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- IMPORTANTE: Importar ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

// Módulos Académicos
import { CarrerasModule } from './carreras/carreras.module';
import { MateriaModule } from './materia/materia.module';
import { CiclosModule } from './ciclos/ciclos.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

// Módulos de Usuarios y Seguridad
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { RolPermisoModule } from './rol-permiso/rol-permiso.module';

@Module({
  imports: [
    // 1. Configuración global de variables de entorno
    // Esto carga el archivo .env para que Prisma y Auth puedan leerlo
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),

    // 2. Base de datos y Auth
    PrismaModule,
    AuthModule,

    // 3. Usuarios y Roles (Seguridad)
    UsuariosModule,
    RolesModule,
    PermisosModule,
    RolPermisoModule,

    // 4. Académico
    CarrerasModule,
    MateriaModule,
    CiclosModule,
    InscripcionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}