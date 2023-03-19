const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();

//Midleware allows the access to req.user so the getMe method works
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
