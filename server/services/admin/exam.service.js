const prisma = require('../../config/db')

const createExam = async(examData) => {
    const { courseName, courseCode, examTypes, numberOfQuestions, duration } = examData;
    const newExam = await prisma.exam.create({
        data: {
          courseName,
          courseCode,
          examTypes,
          numberOfQuestions: parseInt(numberOfQuestions),
          duration: parseInt(duration),
        },
      });
  
      return newExam;
}
       const getAllExam = async() =>{
     const exam = await prisma.exam.findMany({
      orderBy: { createdAt: 'desc' },
     })
     return exam;
}

      const getExamById = async(id) =>{
        const exam = await prisma.exam.findUnique({
          where: { id: String(id)}})
          return exam;
      }
module.exports = {createExam, getAllExam, getExamById}