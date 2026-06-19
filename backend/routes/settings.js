const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settingsController');
const auth = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.put('/', auth, ctrl.update);

module.exports = router;
