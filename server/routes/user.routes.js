const express = require('express')
const router = express.Router()
const {getStudentExamsController, submitExamController} = require("../controller/student/student.controller")
router.get("/:matricNo", getStudentExamsController)
router.post("/submit", submitExamController)


module.exports = router