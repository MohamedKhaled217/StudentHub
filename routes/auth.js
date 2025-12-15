const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { isGuest } = require('../middleware/auth');
const { Idupload } = require('../config/multer')
const authController = require('../controllers/authController')

// GET Signup Page
router.get('/signup', isGuest, authController.GetSignUp);

// POST Signup
router.post('/signup',
    Idupload.single('studentIdDocument'),
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid university email is required')
            .custom(value => value.endsWith('@eng.psu.edu.eg'))
            .withMessage('Must use university email (@eng.psu.edu.eg)'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('studentId').trim().notEmpty().withMessage('Student ID is required')
    ],
    authController.SignUp
);

// GET Login Page
router.get('/login', isGuest, authController.GetLogin);

// POST Login
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    authController.login
);

// GET Logout
router.get('/logout', authController.logout);

module.exports = router;