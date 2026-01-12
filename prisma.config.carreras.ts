import { defineConfig, env } from '@prisma/config';
import "dotenv/config";

export default defineConfig({
  schema: 'prisma/schema_carreras.prisma',
  migrations: {
    path:"prisma/migrations_carreras",
  },
  datasource: {
  
    url: env("DATABASE_URL_CARRERAS"), // Asegúrate de tener esta variable en tu .env
  },
  
 
});