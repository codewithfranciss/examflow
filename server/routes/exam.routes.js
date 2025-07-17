const express = require('express')
const router = express.Router()

const {createExamController, fetchAllExam, fetchExamById} = require("../controller/admin/exam.controller")

router.post("/create", createExamController)
router.get("/fetch-exam", fetchAllExam)
router.get('/fetch-exam/:id', fetchExamById)

module.exports = router