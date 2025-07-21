const express = require('express')
const router = express.Router()
const {createQuestionController} = require("../controller/admin/question.controller")
const {createExamController, fetchAllExam, fetchExamById, updateExamController, deleteExamController, getStudentPerformanceController} = require("../controller/admin/exam.controller")

router.post("/create", createExamController)
router.get("/fetch-exam", fetchAllExam)
router.get('/fetch-exam/:id', fetchExamById)
router.put("/edit-exam/:id", updateExamController)
router.delete("/delete-exam/:examId", deleteExamController)
router.post("/create-question/:examId", createQuestionController)
router.get("/performance/:examId", getStudentPerformanceController)

module.exports = router