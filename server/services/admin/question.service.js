const prisma = require('../../config/db')

const createQuestion = async(examId, questions) =>{
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
      });
    
      if (!exam) {
        throw new Error('Exam not found.');
      } 
    
    const formattedQuestions = questions.map((q) => ({
        question: q.question,
        type: q.type,
        correctAnswer: q.correctAnswer || null,
        options: q.options || [],
        examId,
      }))

      const result = await prisma.question.createMany({
        data: formattedQuestions,
      })

      return result
}

module.exports ={createQuestion}