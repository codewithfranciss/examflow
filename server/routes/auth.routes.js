const express = require('express')
const router = express.Router()

const{loginAdminController} = require ('../controller/auth/admin.authController')

router.post("/admin", loginAdminController)

module.exports = router