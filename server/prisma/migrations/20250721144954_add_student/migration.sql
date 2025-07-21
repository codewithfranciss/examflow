/*
  Warnings:

  - You are about to drop the `StudentPerformance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentPerformance" DROP CONSTRAINT "StudentPerformance_examId_fkey";

-- DropTable
DROP TABLE "StudentPerformance";
