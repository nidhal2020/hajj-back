-- CreateTable
CREATE TABLE "Scanne" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "pilgrimId" TEXT NOT NULL,

    CONSTRAINT "Scanne_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Scanne" ADD CONSTRAINT "Scanne_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scanne" ADD CONSTRAINT "Scanne_pilgrimId_fkey" FOREIGN KEY ("pilgrimId") REFERENCES "Pilgrim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
