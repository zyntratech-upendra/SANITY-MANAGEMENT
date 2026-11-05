const express = require('express');
const router = express.Router();
const {
  updateTelemetry,
  simulateSensorEvent,
} = require('../controllers/telemetryController');

router.post('/update/:id', updateTelemetry);
router.post('/simulate', simulateSensorEvent);

module.exports = router;

