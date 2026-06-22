const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const auth = require('../middleware/auth');

// Public routes (no auth)
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Admin routes (require auth)
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
router.patch('/:id/toggle-visibility', auth, ctrl.toggleVisibility);

module.exports = router;