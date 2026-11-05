const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Facility = require('../models/Facility');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc Login user (Any role: Admin, Municipal Lead, Worker, Citizen)
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).populate('allottedFacilities');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ward: user.ward,
        allottedFacilities: user.allottedFacilities,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Register Citizen (Public)
// @route POST /api/auth/register-citizen
const registerCitizen = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'CITIZEN',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Citizen account registered successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Admin creates a Municipal Lead
// @route POST /api/auth/create-lead
const createMunicipalLead = async (req, res) => {
  try {
    const { name, email, password, phone, ward, allottedFacilities = [] } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required for Municipal Lead.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'MUNICIPAL_LEAD',
      ward: ward || 'Central Ward',
      allottedFacilities,
      createdBy: req.user?._id,
      createdByName: req.user?.name || 'Chief Administrator',
    });

    // Update facilities to reference this lead
    if (allottedFacilities.length > 0) {
      await Facility.updateMany(
        { _id: { $in: allottedFacilities } },
        { assignedLead: { userId: user._id, name: user.name, email: user.email } }
      );
    }

    res.status(201).json({
      success: true,
      message: `Municipal Lead account created for ${user.name}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ward: user.ward,
        allottedFacilities: user.allottedFacilities,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Municipal Lead or Admin creates a Worker
// @route POST /api/auth/create-worker
const createWorker = async (req, res) => {
  try {
    const { name, email, password, phone, ward, allottedFacilities = [] } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required for Sanitation Worker.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: 'WORKER',
      ward: ward || req.user?.ward || 'Central Ward',
      allottedFacilities,
      createdBy: req.user?._id,
      createdByName: req.user?.name || 'Municipal Officer',
    });

    // Update facilities to reference this worker
    if (allottedFacilities.length > 0) {
      await Facility.updateMany(
        { _id: { $in: allottedFacilities } },
        {
          assignedWorker: { userId: user._id, name: user.name, phone: user.phone },
          assignedStaff: { staffId: user._id.toString(), name: user.name, phone: user.phone },
        }
      );
    }

    res.status(201).json({
      success: true,
      message: `Field Sanitation Worker login created for ${user.name}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ward: user.ward,
        allottedFacilities: user.allottedFacilities,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Allot facilities to Lead or Worker
// @route POST /api/auth/allot-facilities
const allotFacilities = async (req, res) => {
  try {
    const { targetUserId, facilityIds = [] } = req.body;
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found.' });
    }

    targetUser.allottedFacilities = facilityIds;
    await targetUser.save();

    if (targetUser.role === 'MUNICIPAL_LEAD') {
      await Facility.updateMany(
        { _id: { $in: facilityIds } },
        { assignedLead: { userId: targetUser._id, name: targetUser.name, email: targetUser.email } }
      );
    } else if (targetUser.role === 'WORKER') {
      await Facility.updateMany(
        { _id: { $in: facilityIds } },
        {
          assignedWorker: { userId: targetUser._id, name: targetUser.name, phone: targetUser.phone },
          assignedStaff: { staffId: targetUser._id.toString(), name: targetUser.name, phone: targetUser.phone },
        }
      );
    }

    res.json({
      success: true,
      message: `Facilities allotted successfully to ${targetUser.name}.`,
      user: targetUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get users by role (e.g. leads, workers, citizens)
// @route GET /api/auth/users
const getUsers = async (req, res) => {
  try {
    const { role, ward } = req.query;
    let query = {};
    if (role && role !== 'ALL') query.role = role;
    if (ward && ward !== 'ALL') query.ward = ward;

    const users = await User.find(query).select('-password').populate('allottedFacilities').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get current profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('allottedFacilities');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  login,
  registerCitizen,
  createMunicipalLead,
  createWorker,
  allotFacilities,
  getUsers,
  getMe,
};

