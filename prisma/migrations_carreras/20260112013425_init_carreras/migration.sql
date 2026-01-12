-- CreateTable
CREATE TABLE "carreras" (
    "id_carrera" SERIAL NOT NULL,
    "nombre_carrera" TEXT NOT NULL,
    "descripcion" TEXT,
    "duracion_semestres" INTEGER,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id_carrera")
);

-- CreateTable
CREATE TABLE "materias" (
    "id_materia" SERIAL NOT NULL,
    "nombre_materia" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "id_carrera" INTEGER NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "ciclos" (
    "id_ciclo" SERIAL NOT NULL,
    "nombre_ciclo" TEXT NOT NULL,
    "fecha_inicio" DATE,
    "fecha_fin" DATE,

    CONSTRAINT "ciclos_pkey" PRIMARY KEY ("id_ciclo")
);

-- CreateIndex
CREATE UNIQUE INDEX "carreras_nombre_carrera_key" ON "carreras"("nombre_carrera");

-- CreateIndex
CREATE UNIQUE INDEX "ciclos_nombre_ciclo_key" ON "ciclos"("nombre_ciclo");

-- AddForeignKey
ALTER TABLE "materias" ADD CONSTRAINT "materias_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "carreras"("id_carrera") ON DELETE RESTRICT ON UPDATE CASCADE;
