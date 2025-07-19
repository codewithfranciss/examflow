/*
  Warnings:

  - A unique constraint covering the columns `[matricNo,examId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_matricNo_key";

-- CreateIndex
CREATE UNIQUE INDEX "Student_matricNo_examId_key" ON "Student"("matricNo", "examId");
