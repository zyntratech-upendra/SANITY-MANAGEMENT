const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
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
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterName: {
      type: String,
      default: 'Citizen User',
    },
    reporterPhone: {
      type: String,
      default: '',
    },
    reporterEmail: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    issues: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'HIGH',
    },
    status: {
      type: String,
      enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
      default: 'OPEN',
    },
    generatedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    assignedWorkerName: {
      type: String,
      default: 'Automated Dispatch Pending',
    },
    assignedLeadName: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
