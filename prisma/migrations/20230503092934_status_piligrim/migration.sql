-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NORMAL', 'SICK', 'LOST', 'DEAD');

-- AlterTable
ALTER TABLE "Pilgrim" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NORMAL';
