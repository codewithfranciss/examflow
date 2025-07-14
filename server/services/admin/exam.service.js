const prisma = require('../../config/db')

const createExam = async(examData) => {
    const { courseName, courseCode, examTypes, numberOfQuestions, duration } = examData;
    const newExam = await prisma.exam.create({
        data: {
          courseName,
          courseCode,
          examTypes: JSON.stringify(examTypes), // Convert array to JSON string
          numberOfQuestions: parseInt(numberOfQuestions),
          duration: parseInt(duration),
        },
      });
  
      return newExam;
}

module.exports = {createExam}