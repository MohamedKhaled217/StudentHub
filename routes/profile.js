const express = require('express');
const router = express.Router();
const { Profileupload } = require('../config/multer')
const { isAuthenticated, isApproved } = require('../middleware/auth');
const { validateProfileContent } = require('../middleware/contentModeration');
const profileController = require('../controllers/profileController')

// GET My Profile
router.get('/me', isAuthenticated, isApproved, profileController.GetProfile);

// GET Edit Profile
router.get('/edit', isAuthenticated, isApproved, profileController.GetEdit);

// POST Update Profile
router.post('/edit',
  isAuthenticated,
  isApproved,
  Profileupload.single('profilePhoto'),
  validateProfileContent,
  profileController.EditProfile
);

// POST Add Skill
router.post('/skill/add', isAuthenticated, isApproved, profileController.AddSkill);

// POST Add Project
router.post('/project/add', isAuthenticated, isApproved, validateProfileContent, profileController.AddProject);

// GET View Profile by username
router.get('/:userName', profileController.ProfileByUsername);

module.exports = router;