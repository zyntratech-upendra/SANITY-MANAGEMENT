const express = require('express');
const router = express.Router();
const {
  getStaff,
  createStaff,
  updateStaff,
  getStaffStats,
} = require('../controllers/staffController');

router.get('/', getStaff);
router.get('/stats', getStaffStats);
router.post('/', createStaff);
router.put('/:id', updateStaff);

module.exports = router;

