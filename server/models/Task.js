const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    facilityCode: {
      type: String,
      required: true,
    },
    facilityName: {
      type: String,
      required: true,
    },
    targetBlock: {
      type: String,
      default: 'Entire Center',
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['CLEANING', 'PLUMBING_WATER', 'ELECTRICAL', 'DISPENSER_REFILL', 'SANITARY_INSPECTION'],
      default: 'CLEANING',
    },
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    source: {
      type: String,
      enum: ['CITIZEN_COMPLAINT', 'IOT_AUTO_TRIGGER', 'ROUTINE_SCHEDULE', 'MANUAL_DISPATCH'],
      default: 'CITIZEN_COMPLAINT',
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    assignedWorker: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'Duty Worker' },
      phone: { type: String, default: '' },
    },
    assignedLead: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'Ward Lead' },
    },
    // Backwards compatibility
    assignedStaff: {
      staffId: { type: String, default: '' },
      name: { type: String, default: 'Duty Worker' },
      phone: { type: String, default: '' },
    },
    checklist: [
      {
        taskItem: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);
