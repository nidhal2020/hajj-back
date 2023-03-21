/*
  Warnings:

  - You are about to drop the column `groupid` on the `Chef` table. All the data in the column will be lost.
  - Added the required column `chefId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chef" DROP CONSTRAINT "Chef_groupid_fkey";

-- AlterTable
ALTER TABLE "Chef" DROP COLUMN "groupid";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "chefId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "Chef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
