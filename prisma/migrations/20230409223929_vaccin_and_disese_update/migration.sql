/*
  Warnings:

  - A unique constraint covering the columns `[diseaseName]` on the table `Disease` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vaccinName]` on the table `Vaccin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Disease_diseaseName_key" ON "Disease"("diseaseName");

-- CreateIndex
CREATE UNIQUE INDEX "Vaccin_vaccinName_key" ON "Vaccin"("vaccinName");
