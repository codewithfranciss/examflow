-- CreateTable
CREATE TABLE "StudentPerformance" (
    "id" TEXT NOT NULL,
    "matricNo" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "lecturer" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentPerformance_matricNo_examId_key" ON "StudentPerformance"("matricNo", "examId");

-- AddForeignKey
ALTER TABLE "StudentPerformance" ADD CONSTRAINT "StudentPerformance_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
