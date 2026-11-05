const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  blockName: { type: String, required: true }, // e.g. "Male Section", "Female Section", "Accessible / Baby Care"
  type: {
    type: String,
    enum: ['Male', 'Female', 'All-Gender', 'Accessible', 'Urinal-Only'],
    default: 'All-Gender',
  },
  stallsCount: { type: Number, default: 2 },
  urinalsCount: { type: Number, default: 0 },
});

const facilitySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // e.g. "Central Plaza & Metro Sanitation Center"
    },
    buildingName: {
      type: String,
      default: 'Main Facility Building',
      trim: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    blocks: [blockSchema],
    totalStallsCount: {
      type: Number,
      default: 5,
    },
    features: {
      accessible: { type: Boolean, default: true },
      babyCare: { type: Boolean, default: false },
      sanitaryVending: { type: Boolean, default: true },
      touchlessSensors: { type: Boolean, default: true },
    },
    operatingHours: {
      type: String,
      default: '24/7',
    },
    status: {
      availability: {
        type: String,
        enum: ['AVAILABLE', 'OCCUPIED', 'CLEANING_IN_PROGRESS', 'MAINTENANCE_REQUIRED', 'OUT_OF_SERVICE'],
        default: 'AVAILABLE',
      },
      cleanliness: {
        type: String,
        enum: ['EXCELLENT', 'SATISFACTORY', 'NEEDS_ATTENTION', 'CRITICAL_UNHYGIENIC'],
        default: 'EXCELLENT',
      },
      lastCleanedAt: {
        type: Date,
        default: Date.now,
      },
      nextScheduledClean: {
        type: Date,
      },
    },
    telemetry: {
      waterLevel: { type: Number, default: 85, min: 0, max: 100 },
      odorLevelPpm: { type: Number, default: 14, min: 0, max: 100 },
      isOccupied: { type: Boolean, default: false },
      footfallCountToday: { type: Number, default: 42 },
      soapLevel: { type: Number, default: 90, min: 0, max: 100 },
      paperLevel: { type: Number, default: 80, min: 0, max: 100 },
      sensorOnline: { type: Boolean, default: true },
      lastSensorUpdate: { type: Date, default: Date.now },
    },
    assignedLead: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'Unassigned Municipal Lead' },
      email: { type: String, default: '' },
    },
    assignedWorker: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'Unassigned Field Worker' },
      phone: { type: String, default: '' },
    },
    // Backwards compatibility helper
    assignedStaff: {
      staffId: { type: String, default: '' },
      name: { type: String, default: 'Duty Worker' },
      phone: { type: String, default: '' },
    },
    qrCodeData: {
      type: String,
      default: '',
    },
    ratings: {
      average: { type: Number, default: 4.6 },
      count: { type: Number, default: 12 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Facility || mongoose.model('Facility', facilitySchema);
