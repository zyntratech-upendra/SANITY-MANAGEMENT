const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Sanitation Specialist', 'Plumbing & Water Technician', 'Field Supervisor', 'Rapid Response Sanitizer'],
      default: 'Sanitation Specialist',
    },
    phone: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ON_DUTY', 'ON_BREAK', 'BUSY', 'OFF_DUTY'],
      default: 'ON_DUTY',
    },
    activeTaskId: {
      type: String,
      default: '',
    },
    completedTasksCount: {
      type: Number,
      default: 0,
    },
    avgCleaningDurationMins: {
      type: Number,
      default: 18,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Staff || mongoose.model('Staff', staffSchema);
