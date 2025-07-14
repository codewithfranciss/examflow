const {createExam} = require("../../services/admin/exam.service")

const createExamController = async (req, res) => {
    try{
        const exam = await createExam(req.body);
        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (error) {
      console.error("Create Exam Error:", error);
      res.status(500).json({ error: "Failed to create exam" });
    }
}

module.exports = {createExamController}