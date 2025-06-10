
const express = require('express');
const router = express.Router();

const { adminLogin, getCurrentUser, registerUser, Contact } = require('../controllers/user');
const isAdmin = require('../middleware/isAdmin');



router.post('/admin/login', adminLogin);
router.post('/admin/register', registerUser);
router.post('/contact', Contact);
// Get current logged-in user (only authenticated users can access this route)
router.get('/me', isAdmin, getCurrentUser);

module.exports = router;