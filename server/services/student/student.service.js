const prisma = require('../../config/db');

const getExamsForStudent = async (matricNo) => {
  const studentWithExams = await prisma.student.findMany({
    where: { matricNo },
    include: {
      exam: {
        include: {
          questions: {
            select: {
              id: true,
              question: true,
              type: true,
              options: true,
            },
          },
        },
      },
    },
  });

  if (!studentWithExams.length) {
    throw new Error("No exams found for this student.");
  }

  return studentWithExams.map((student) => ({
    id: student.exam.id,
    courseName: student.exam.courseName,
    courseCode: student.exam.courseCode,
    examTypes: student.exam.examTypes,
    numberOfQuestions: student.exam.numberOfQuestions,
    duration: student.exam.duration,
    department: student.department,     
    lecturer: student.lecturer,         
    questions: student.exam.questions,
  }));
};


const submitExam = async (data) => {
  const {
    matricNo,
    fullName,
    department,
    lecturer,
    examId,
    answers,
  } = data

  // Prevent duplicate submission
  const existing = await prisma.studentPerformance.findUnique({
    where: {
      matricNo_examId: { matricNo, examId },
    },
  })

  if (existing) {
    throw new Error("You have already submitted this exam.")
  }

  // Fetch the exam and its questions
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true },
  })

  if (!exam) {
    throw new Error("Exam not found.")
  }

  const totalQuestions = exam.questions.length

  // Create a Map for quick answer lookup by questionId
  const studentAnswers = new Map(
    answers.map((a) => [a.questionId, a.answer.trim().toLowerCase()])
  )

  // Compute score
  let score = 0

  exam.questions.forEach((q) => {
    const correct = q.correctAnswer?.trim().toLowerCase()
    const submitted = studentAnswers.get(q.id)
    if (correct && submitted && correct === submitted) {
      score++
    }
  })

  // Save to StudentPerformance table
  await prisma.studentPerformance.create({
    data: {
      matricNo,
      fullName,
      department,
      lecturer,
      examId,
      score,
      totalQuestions,
    },
  })

  return {
    message: "Exam submitted successfully.",
    result: {
      score,
      totalQuestions,
    },
  }
}



module.exports = { getExamsForStudent, submitExam };
