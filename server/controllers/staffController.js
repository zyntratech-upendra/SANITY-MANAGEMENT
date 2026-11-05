const Staff = require('../models/Staff');
const Task = require('../models/Task');

// GET all staff members
const getStaff = async (req, res) => {
  try {
    const { status, zone } = req.query;
    let query = {};
    if (status && status !== 'ALL') query.status = status;
    if (zone && zone !== 'ALL') query.zone = zone;

    const staffList = await Staff.find(query).sort({ completedTasksCount: -1 });
    res.json({ success: true, count: staffList.length, data: staffList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE staff member
const createStaff = async (req, res) => {
  try {
    const { name, role, phone, zone } = req.body;
    const count = await Staff.countDocuments();
    const staffId = req.body.staffId || `STF-${String(count + 1).padStart(2, '0')}`;

    const staff = new Staff({
      staffId,
      name,
      role: role || 'Sanitation Specialist',
      phone,
      zone: zone || 'Central Ward',
      status: 'ON_DUTY',
    });

    await staff.save();
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE staff member
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET staff performance metrics & leaderboard
const getStaffStats = async (req, res) => {
  try {
    const totalStaff = await Staff.countDocuments();
    const onDuty = await Staff.countDocuments({ status: { $in: ['ON_DUTY', 'BUSY'] } });
    const busy = await Staff.countDocuments({ status: 'BUSY' });
    const completedTasksToday = await Task.countDocuments({
      status: 'COMPLETED',
      completedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    const topPerformers = await Staff.find().sort({ completedTasksCount: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalStaff,
        onDuty,
        busy,
        completedTasksToday,
        topPerformers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  getStaffStats,
};

