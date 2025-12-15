const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { isGuest } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/documents/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'student-id-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images and PDFs are allowed'));
    }
});

// GET Signup Page
router.get('/signup', isGuest, (req, res) => {
    res.render('signup', { title: 'Sign Up', errors: [] });
});

// POST Signup
router.post('/signup',
    upload.single('studentIdDocument'),
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid university email is required')
            .custom(value => value.endsWith('@eng.psu.edu.eg'))
            .withMessage('Must use university email (@eng.psu.edu.eg)'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('studentId').trim().notEmpty().withMessage('Student ID is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('signup', {
                title: 'Sign Up',
                errors: errors.array(),
                ...req.body
            });
        }

        try {
            const { name, email, password, studentId } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
            if (existingUser) {
                return res.render('signup', {
                    title: 'Sign Up',
                    errors: [{ msg: 'Email or Student ID already registered' }],
                    ...req.body
                });
            }

            // Check if document was uploaded
            if (!req.file) {
                return res.render('signup', {
                    title: 'Sign Up',
                    errors: [{ msg: 'Student ID document is required' }],
                    ...req.body
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            await User.create({
                name,
                email,
                password: hashedPassword,
                studentId,
                studentIdDocument: '/uploads/documents/' + req.file.filename,
                status: 'pending'
            });

            req.session.success_msg = 'Registration successful! Please wait for admin approval.';
            res.redirect('/auth/login');
        } catch (error) {
            console.error(error);
            res.render('signup', {
                title: 'Sign Up',
                errors: [{ msg: 'Registration failed. Please try again.' }],
                ...req.body
            });
        }
    }
);

// GET Login Page
router.get('/login', isGuest, (req, res) => {
    res.render('login', { title: 'Login', errors: [] });
});

// POST Login
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('login', {
                title: 'Login',
                errors: errors.array(),
                email: req.body.email
            });
        }

        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('login', {
                    title: 'Login',
                    errors: [{ msg: 'Invalid email or password' }],
                    email
                });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('login', {
                    title: 'Login',
                    errors: [{ msg: 'Invalid email or password' }],
                    email
                });
            }

            // Check if account is approved (unless admin)
            if (user.role !== 'admin' && user.status !== 'approved') {
                return res.render('login', {
                    title: 'Login',
                    errors: [{ msg: `Your account is ${user.status}. Please wait for admin approval.` }],
                    email
                });
            }

            // Set session
            req.session.user = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            };

            req.session.success_msg = 'Login successful!';

            if (user.role === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/profile/me');
            }
        } catch (error) {
            console.error(error);
            res.render('login', {
                title: 'Login',
                errors: [{ msg: 'Login failed. Please try again.' }],
                email: req.body.email
            });
        }
    }
);

// GET Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/');
    });
});

module.exports = router;