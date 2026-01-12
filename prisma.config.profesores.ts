import { defineConfig, env } from '@prisma/config';
import "dotenv/config";

export default defineConfig({
  schema: 'prisma/schema_profesores.prisma',
  migrations: {
    path:"prisma/migrations_profesores",
  },
  datasource: {
  
    url: env("DATABASE_URL_PROFESORES"), // Asegúrate de tener esta variable en tu .env
  },
  
 
});
