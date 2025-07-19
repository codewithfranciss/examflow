const express = require('express')
const router = express.Router()
const {createStudentController, bulkUploadStudents} = require('../controller/admin/student.controller')

router.post("/register/:examId", createStudentController)
router.post("/bulk-register/:examId", bulkUploadStudents)

module.exports = router