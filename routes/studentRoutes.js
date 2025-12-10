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

router.get('/profile/:alias', controller.getProfile)

router.put('/editProfile',
    require('../utils/auth').protected,
    upload.single('avatar'),
    controller.updateProfile
)

router.post('/logout',
    require('../utils/auth').protected,
    controller.logout
)

router.post('/createProject',
    require('../utils/auth').protected,
    controller.createProject
)

router.put('/editProject/:projectId',
    require('../utils/auth').protected,
    upload.array('images', 5),
    controller.editProject
)


module.exports = router