const express = require('express');
const router = express.Router();
const {
  login,
  registerCitizen,
  createMunicipalLead,
  createWorker,
  allotFacilities,
  getUsers,
  getMe,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/login', login);
router.post('/register-citizen', registerCitizen);

// Authenticated user profile
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

// Admin-only endpoints
router.post('/create-lead', protect, authorize('ADMIN'), createMunicipalLead);

// Lead or Admin endpoints
router.post('/create-worker', protect, authorize('ADMIN', 'MUNICIPAL_LEAD'), createWorker);
router.post('/allot-facilities', protect, authorize('ADMIN', 'MUNICIPAL_LEAD'), allotFacilities);

module.exports = router;

