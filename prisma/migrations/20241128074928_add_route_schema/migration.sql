/*
  Warnings:

  - You are about to drop the column `lineId` on the `Station` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Station" DROP CONSTRAINT "Station_lineId_fkey";

-- AlterTable
ALTER TABLE "Station" DROP COLUMN "lineId";

-- CreateTable
CREATE TABLE "Routes" (
    "id" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Routes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routes" ADD CONSTRAINT "Routes_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
