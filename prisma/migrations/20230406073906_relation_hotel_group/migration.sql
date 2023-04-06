/*
  Warnings:

  - Added the required column `hotelid` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "hotelid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "capacity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
