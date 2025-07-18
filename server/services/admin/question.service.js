const prisma = require('../../config/db')

const createQuestion = async(examId, questions) =>{
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