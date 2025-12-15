const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController')

// All routes require admin authentication
router.use(isAdmin);

// GET Admin Dashboard
router.get('/dashboard', adminController.GetStats);

// GET Pending Requests
router.get('/pending', adminController.GetPending);

// POST Approve User
router.post('/approve/:id', adminController.GetAprroved);

// POST Reject User
router.post('/reject/:id', adminController.GetRejected);

// GET All Students
router.get('/students', adminController.GetAllStudents);

// POST Delete Student
router.post('/student/delete/:id', adminController.DeleteStudent);

// GET Banned Words Management
router.get('/banned-words', adminController.GetBannedWords);

// POST Add Banned Word
router.post('/banned-word/add', adminController.AddBannedWords);

// POST Delete Banned Word
router.post('/banned-word/delete/:id', adminController.DeleteBannedWords);

module.exports = router;