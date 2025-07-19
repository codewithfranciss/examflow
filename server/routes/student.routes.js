const express = require('express')
const router = express.Router()
const {createStudentController} = require('../controller/admin/student.controller')

router.post("register", createStudentController)

module.exports = router