const express = require('express')
const router = express.Router()

const{loginAdminController} = require ('../controller/auth/admin.authController')
const {loginStudentController} = require('../controller/auth/student.authController')

router.post("/admin", loginAdminController)
router.post("/student", loginStudentController)

module.exports = router