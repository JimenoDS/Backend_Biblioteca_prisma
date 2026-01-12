-- CreateTable
CREATE TABLE "profesores" (
    "id_profesor" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "titulos" (
    "id_titulo" SERIAL NOT NULL,
    "nombre_titulo" TEXT NOT NULL,
    "universidad_emisora" TEXT,
    "fecha_obtencion" DATE,
    "id_profesor" INTEGER NOT NULL,

    CONSTRAINT "titulos_pkey" PRIMARY KEY ("id_titulo")
);

-- CreateTable
CREATE TABLE "profesor_materia" (
    "id" SERIAL NOT NULL,
    "id_profesor" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,

    CONSTRAINT "profesor_materia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profesores_cedula_key" ON "profesores"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "profesores_email_key" ON "profesores"("email");

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "profesores"("id_profesor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesor_materia" ADD CONSTRAINT "profesor_materia_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "profesores"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;
