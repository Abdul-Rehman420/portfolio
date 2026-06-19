const express = require('express');
const router = express.Router();
const { login, verify } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/verify', auth, verify);

module.exports = router;
