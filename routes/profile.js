const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { isAuthenticated, isApproved } = require('../middleware/auth');
const { validateProfileContent } = require('../middleware/contentModeration');

// Configure multer for profile photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// GET My Profile
router.get('/me', isAuthenticated, isApproved, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('profile', { title: 'My Profile', profile: user, isOwner: true });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// GET Edit Profile
router.get('/edit', isAuthenticated, isApproved, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('edit-profile', { title: 'Edit Profile', user });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// POST Update Profile
router.post('/edit', 
  isAuthenticated, 
  isApproved,
  upload.single('profilePhoto'),
  validateProfileContent,
  async (req, res) => {
    try {
      const { bio, interests, phone, linkedin, github, portfolio, visibility } = req.body;
      
      const updateData = {
        bio,
        interests: interests ? interests.split(',').map(i => i.trim()).filter(i => i) : [],
        contactInfo: { phone, linkedin, github, portfolio },
        visibility
      };

      if (req.file) {
        updateData.profilePhoto = '/uploads/profiles/' + req.file.filename;
      }

      await User.findByIdAndUpdate(req.session.user._id, updateData);

      req.session.success_msg = 'Profile updated successfully!';
      res.redirect('/profile/me');
    } catch (error) {
      console.error(error);
      req.session.error_msg = 'Failed to update profile';
      res.redirect('/profile/edit');
    }
  }
);

// POST Add Skill
router.post('/skill/add', isAuthenticated, isApproved, async (req, res) => {
  try {
    const { name, level } = req.body;
    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { skills: { name, level: parseInt(level) } }
    });
    req.session.success_msg = 'Skill added successfully!';
    res.redirect('/profile/edit');
  } catch (error) {
    console.error(error);
    req.session.error_msg = 'Failed to add skill';
    res.redirect('/profile/edit');
  }
});

// POST Add Project
router.post('/project/add', isAuthenticated, isApproved, validateProfileContent, async (req, res) => {
  try {
    const { name, description, githubLink, liveLink } = req.body;
    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { projects: { name, description, githubLink, liveLink } }
    });
    req.session.success_msg = 'Project added successfully!';
    res.redirect('/profile/edit');
  } catch (error) {
    console.error(error);
    req.session.error_msg = 'Failed to add project';
    res.redirect('/profile/edit');
  }
});

// GET View Profile by Slug
router.get('/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ 
      name: new RegExp('^' + req.params.slug.replace(/-/g, ' ') + '$', 'i')
    });

    if (!user) {
      return res.status(404).render('404', { title: 'Profile Not Found' });
    }

    // Check visibility permissions
    if (user.visibility === 'private' && (!req.session.user || req.session.user.role !== 'admin')) {
      req.session.error_msg = 'This profile is private';
      return res.redirect('/');
    }

    if (user.visibility === 'university' && !req.session.user) {
      req.session.error_msg = 'Please login to view this profile';
      return res.redirect('/auth/login');
    }

    const isOwner = req.session.user && req.session.user._id.toString() === user._id.toString();
    
    res.render('profile', { title: user.name, profile: user, isOwner });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;