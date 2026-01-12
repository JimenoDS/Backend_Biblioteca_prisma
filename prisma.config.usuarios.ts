import { defineConfig, env } from '@prisma/config';
import "dotenv/config";

export default defineConfig({
  schema: 'prisma/schema_usuarios.prisma',
  migrations: {
    path:"prisma/migrations_usuarios",
  },
  datasource: {
  
    url: env("DATABASE_URL_USUARIOS"), // Asegúrate de tener esta variable en tu .env
  },
  
  
 
});