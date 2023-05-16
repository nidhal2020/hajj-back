/*
  Warnings:

  - Added the required column `action` to the `Scanne` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scanne" ADD COLUMN     "action" "Status" NOT NULL;
