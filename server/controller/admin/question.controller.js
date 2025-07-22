const {createQuestion} = require('../../services/admin/question.service')

const createQuestionController = async(req, res) =>{
    try {
        const { examId } = req.params
        const { questions } = req.body
        
    
        if (!examId) return res.status(400).json({ message: "Exam ID is required" })
        if (!Array.isArray(questions) || questions.length === 0) {
          return res.status(400).json({ message: "Questions array is required" })
        }
    
        const result = await createQuestion(examId, questions)
        res.status(201).json({ message: "Questions saved successfully", data: result })
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to save questions", error: err.message })
      }
}

module.exports ={
    createQuestionController
}