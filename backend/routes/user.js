const express = require('express')
//contoller funstions
const { signupUser, loginUser } = require('../controllers/userController')
const router = express.Router()
//login route
router.post('/login', loginUser)
//sihnup route
router.post('/signup', signupUser)
module.exports = router