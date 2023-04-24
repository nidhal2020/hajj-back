-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_chefId_fkey";

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "chefId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "Chef"("id") ON DELETE SET NULL ON UPDATE CASCADE;
