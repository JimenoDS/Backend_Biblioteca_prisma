// prisma/seed_usuarios.ts
import { PrismaClient } from '@prisma/client-usuarios'; // Tu cliente específico
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// 1. Cargar variables de entorno
dotenv.config();

const connectionString = process.env.DATABASE_URL_USUARIOS;

if (!connectionString) {
  console.error('❌ ERROR FATAL: No existe DATABASE_URL_USUARIOS en el .env');
  process.exit(1);
}

// 2. Configurar el Adaptador (La forma correcta en Prisma 7 + Config)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Inicializar Prisma usando el 'adapter'
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando Seed de Usuarios (Vía Adapter)...');

  // --- CREAR ROLES ---
  // Mantenemos los roles clave para que el sistema funcione, pero el código es idéntico
  const rolAdmin = await prisma.rol.upsert({
    where: { nombre_rol: 'Admin' },
    update: {},
    create: { nombre_rol: 'Admin' },
  });

  await prisma.rol.upsert({
    where: { nombre_rol: 'Estudiante' },
    update: {},
    create: { nombre_rol: 'Estudiante' },
  });

  await prisma.rol.upsert({
    where: { nombre_rol: 'Profesor' },
    update: {},
    create: { nombre_rol: 'Profesor' },
  });

  console.log('✅ Roles verificados');

  // --- CREAR USUARIO ADMIN (DATOS CAMBIADOS) ---
  const passwordHash = await bcrypt.hash('admin123', 10);

  // He cambiado los datos de este usuario específico:
  const admin = await prisma.usuario.upsert({
    where: { email: 'rector@universidad.edu.ec' }, // Email cambiado
    update: {},
    create: {
      nombres: 'Roberto',           // Nombre cambiado
      apellidos: 'Gomez',           // Apellido cambiado
      cedula: '0900900900',         // Cédula cambiada
      email: 'rector@universidad.edu.ec', // Email cambiado
      password: passwordHash,
      id_rol: rolAdmin.id_rol,
      fecha_nacimiento: new Date('1980-01-01'),
    },
  });

  console.log(`✅ Usuario Admin creado: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerramos el pool de conexiones al terminar
    await pool.end(); 
    await prisma.$disconnect();
  });