const express = require('express')
const router = express.Router()
const {getStudentExamsController} = require("../controller/student/student.controller")
router.get("/:matricNo", getStudentExamsController)


module.exports = router