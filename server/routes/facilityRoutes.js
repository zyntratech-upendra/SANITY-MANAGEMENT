const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  updateStaffStatus,
  deleteFacility,
} = require('../controllers/facilityController');

router.get('/', getFacilities);
router.get('/:idOrCode', getFacility);
router.post('/', createFacility);
router.put('/:id', updateFacility);
router.patch('/:id/staff-status', updateStaffStatus);
router.delete('/:id', deleteFacility);

module.exports = router;

