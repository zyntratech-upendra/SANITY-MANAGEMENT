const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MUNICIPAL_LEAD', 'WORKER', 'CITIZEN'],
      default: 'CITIZEN',
    },
    ward: {
      type: String,
      default: 'Central Ward',
    },
    allottedFacilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdByName: {
      type: String,
      default: 'System Admin',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    workerStats: {
      tasksCompletedCount: { type: Number, default: 0 },
      avgCleaningDurationMins: { type: Number, default: 18 },
      rating: { type: Number, default: 4.8 },
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

