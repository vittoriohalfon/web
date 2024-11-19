/*
  Warnings:

  - You are about to drop the column `fileSize` on the `PastPerformance` table. All the data in the column will be lost.
  - Added the required column `size` to the `PastPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PastPerformance" DROP COLUMN "fileSize",
ADD COLUMN     "size" INTEGER NOT NULL;
