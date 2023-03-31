-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "diseaseName" TEXT NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "vaccinName" TEXT NOT NULL,

    CONSTRAINT "Vaccin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pilgrim_Has_Diseases" (
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "pilgrimId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,

    CONSTRAINT "Pilgrim_Has_Diseases_pkey" PRIMARY KEY ("pilgrimId","diseaseId")
);

-- CreateTable
CREATE TABLE "Pilgrim_Has_Vaccins" (
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "pilgrimId" TEXT NOT NULL,
    "vaccinId" TEXT NOT NULL,

    CONSTRAINT "Pilgrim_Has_Vaccins_pkey" PRIMARY KEY ("pilgrimId","vaccinId")
);

-- AddForeignKey
ALTER TABLE "Pilgrim_Has_Diseases" ADD CONSTRAINT "Pilgrim_Has_Diseases_pilgrimId_fkey" FOREIGN KEY ("pilgrimId") REFERENCES "Pilgrim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pilgrim_Has_Diseases" ADD CONSTRAINT "Pilgrim_Has_Diseases_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pilgrim_Has_Vaccins" ADD CONSTRAINT "Pilgrim_Has_Vaccins_pilgrimId_fkey" FOREIGN KEY ("pilgrimId") REFERENCES "Pilgrim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pilgrim_Has_Vaccins" ADD CONSTRAINT "Pilgrim_Has_Vaccins_vaccinId_fkey" FOREIGN KEY ("vaccinId") REFERENCES "Vaccin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
