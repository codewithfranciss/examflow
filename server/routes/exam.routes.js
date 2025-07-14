const express = require('express')
const router = express.Router()

const {createExamController} = require("../controller/admin/admin.createExamController")

router.post("/create", createExamController)

module.exports = router