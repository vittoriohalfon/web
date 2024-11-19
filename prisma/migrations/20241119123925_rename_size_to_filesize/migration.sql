/*
  Warnings:

  - You are about to drop the column `size` on the `PastPerformance` table. All the data in the column will be lost.
  - Added the required column `fileSize` to the `PastPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PastPerformance" DROP COLUMN "size",
ADD COLUMN     "fileSize" INTEGER NOT NULL;
