const express = require('express')
const router = express.Router()
const {createQuestionController} = require("../controller/admin/question.controller")
const {createExamController, fetchAllExam, fetchExamById, updateExamController} = require("../controller/admin/exam.controller")

router.post("/create", createExamController)
router.get("/fetch-exam", fetchAllExam)
router.get('/fetch-exam/:id', fetchExamById)
router.put("/edit-exam/:id", updateExamController)
router.post("/create-question/:examId", createQuestionController)

module.exports = router