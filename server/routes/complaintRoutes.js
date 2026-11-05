const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  resolveComplaint,
} = require('../controllers/complaintController');

router.get('/', getComplaints);
router.post('/', createComplaint);
router.patch('/:id/resolve', resolveComplaint);

module.exports = router;

