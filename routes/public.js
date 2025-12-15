const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController')

// GET Home Page
router.get('/', publicController.GetHome);

// GET Students Directory
router.get('/directory', publicController.directory);

module.exports = router;