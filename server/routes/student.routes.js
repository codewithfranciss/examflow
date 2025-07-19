const express = require('express')
const router = express.Router()
const {createStudentController} = require('../controller/admin/student.controller')

router.post("/register/:examId", createStudentController)

module.exports = router