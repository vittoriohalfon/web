/*
  Warnings:

  - Added the required column `fileName` to the `PastPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PastPerformance" ADD COLUMN     "fileName" TEXT NOT NULL;
