const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BannedWord = require('../models/BannedWord');
const { isAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(isAdmin);

// GET Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingCount = await User.countDocuments({ status: 'pending' });
    const approvedCount = await User.countDocuments({ status: 'approved' });
    const rejectedCount = await User.countDocuments({ status: 'rejected' });
    const flaggedUsers = await User.find({ flaggedContentAttempts: { $gt: 0 } })
      .sort({ flaggedContentAttempts: -1 })
      .limit(10);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: {
        total: totalStudents,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      flaggedUsers
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// GET Pending Requests
router.get('/pending', async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.render('admin/pending', {
      title: 'Pending Requests',
      users: pendingUsers
    });
  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
});

// POST Approve User
router.post('/approve/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'approved' });
    req.session.success_msg = 'User approved successfully';
    res.redirect('/admin/pending');
  } catch (error) {
    console.error(error);
    req.session.error_msg = 'Failed to approve user';
    res.redirect('/admin/pending');
  }
});

// POST Reject User
router.post('/reject/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    req.session.success_msg = 'User rejected';
    res.redirect('/admin/pending');
  } catch (error) {
    console.error(error);
    req.session.error_msg = 'Failed to reject user';
    res.redirect('/admin/pending');
  }
});

// GET All Students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    res.render('admin/students', {
      title: 'All Students',
      students
    });
  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
});

// POST Delete Student
router.post('/student/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.session.success_msg = 'Student deleted successfully';
    res.redirect('/admin/students');
  } catch (error) {
    console.error(error);
    req.session.error_msg = 'Failed to delete student';
    res.redirect('/admin/students');
  }
});

// GET Banned Words Management
router.get('/banned-words', async (req, res) => {
  try {
    const bannedWords = await BannedWord.find().sort({ word: 1 });
    res.render('admin/banned-words', {
      title: 'Banned Words',
      words: bannedWords
    });
  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
});

// POST Add Banned Word
router.post('/banned-word/add', async (req, res) => {
  try {
    const { word } = req.body;
    await BannedWord.create({ word: word.toLowerCase().trim() });
    req.session.success_msg = 'Banned word added successfully';
    res.redirect('/admin/banned-words');
  } catch (error) {
    if (error.code === 11000) {
      req.session.error_msg = 'Word already exists in banned list';
    } else {
      req.session.error_msg = 'Failed to add banned word';
    }
    res.redirect('/admin/banned-words');
  }
});

// POST Delete Banned Word
router.post('/banned-word/delete/:id', async (req, res) => {
  try {
    await BannedWord.findByIdAndDelete(req.params.id);
    req.session.success_msg = 'Banned word removed successfully';
    res.redirect('/admin/banned-words');
  } catch (error) {
    console.error(error);
    req.session.error_msg = 'Failed to remove banned word';
    res.redirect('/admin/banned-words');
  }
});

module.exports = router;