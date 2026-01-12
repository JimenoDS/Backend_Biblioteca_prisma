# Sistema Universitario (NestJS + Prisma)

## Descripción del Proyecto

Este proyecto es una **API RESTful** desarrollada con **NestJS** y **Prisma ORM**, diseñada para gestionar la información de un **sistema universitario**.  
Permite administrar entidades académicas como **Estudiantes, Profesores, Materias, Carreras, Aulas, Títulos, Inscripciones y Asignaciones**, con relaciones complejas y validación de datos.

El objetivo principal es proporcionar una base sólida y escalable para el manejo académico mediante una arquitectura modular, uso de **DTOs** para validación, y control de errores en operaciones con la base de datos **PostgreSQL**.

---

## Tecnologías Utilizadas

- **NestJS** → Framework backend modular basado en Node.js.
- **Prisma ORM** → Mapeo objeto-relacional para trabajar con PostgreSQL.
- **PostgreSQL** → Base de datos relacional.
- **TypeScript** → Tipado estático para un código más robusto.
- **Class Validator / Class Transformer** → Validación de datos en los DTOs.
- **Postman** → Pruebas de los endpoints de la API.

---

##  Puesta en Marcha (Instalación y Ejecución)

Sigue estos pasos para levantar el servidor localmente.

### 1.  Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- Node.js (v18 o superior)
- PostgreSQL

---

# 2. Variables de Entorno

Crea un archivo llamado **`.env`** en la raíz del proyecto y define la cadena de conexión a tu base de datos:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nombre_bd?schema=public"

## 3.Instalación de Dependencias 
Ejecuta el siguiente comando para instalar todos los paquetes necesarios:

npm install

### 4. Configuración de la Base de Datos
Este comando aplicará todas las migraciones para crear la estructura de tablas en tu base de datos:

npx prisma migrate dev

### 5. Iniciar el Servidor
Ejecuta la aplicación en modo desarrollo. El servidor estará disponible en http://localhost:3000.

npm run start:dev

---

## Endpoints Principales

La API cuenta con los siguientes recursos, todos con funcionalidades CRUD básicas (GET, POST, PATCH, DELETE).

- /estudiantes
- /profesores (Soporta creación anidada de Títulos)
- /carreras
- /aulas
- /materias
- /titulos
- /profesor-materia (Para asignar un profesor a una materia)
- /inscripciones (Para inscribir un estudiante en una materia y registrar su nota)

---

## Pruebas con Postman

Se adjunta el archivo backend.postman_collection.json con la colección de Postman para probar todos los endpoints que se realizaron en este trabajo 