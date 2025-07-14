const express = require('express')
const router = express.Router()

const{loginAdminController} = require ('../controller/auth/admin.authController')

router.post("/auth", loginAdminController)

module.exports = router