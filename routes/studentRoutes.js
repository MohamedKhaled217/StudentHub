const express = require('express')
const router = express.Router()
const appError = require('../utils/appError')
const upload = require("../utils/multer")
const controller = require('../controllers/studentController')
const signUpSchema = require('../validation/signUpSchema')
const loginSchema = require('../validation/loginSchema')
const validator = require('../utils/validationMiddleware')

// routes
router.post('/signUp',
    upload.single('scannedId'),
    validator(signUpSchema),
    controller.createStudent
)

router.post('/login',
    validator(loginSchema),
    controller.loginStudent
)

router.get('/profile/:alias')  // get profile

router.route('editProfile')

router.route('createProject')

router.route('editProject')

router.route('logout')


module.exports = router