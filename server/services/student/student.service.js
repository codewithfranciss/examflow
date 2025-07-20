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

module.exports = { getExamsForStudent };
