require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Facility = require('../models/Facility');
const Complaint = require('../models/Complaint');
const Task = require('../models/Task');
const Staff = require('../models/Staff');

async function purgeAllMockData() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is missing from environment variables');
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    // 1. Delete all mock facilities, complaints, tasks, and staffs
    const delFac = await Facility.deleteMany({});
    const delComp = await Complaint.deleteMany({});
    const delTask = await Task.deleteMany({});
    const delStaff = await Staff.deleteMany({});
    console.log(`Deleted mock data:`);
    console.log(`- Facilities: ${delFac.deletedCount}`);
    console.log(`- Complaints: ${delComp.deletedCount}`);
    console.log(`- Tasks: ${delTask.deletedCount}`);
    console.log(`- Staff: ${delStaff.deletedCount}`);

    // 2. Delete all non-admin users
    const delUsers = await User.deleteMany({ role: { $ne: 'ADMIN' } });
    console.log(`- Non-admin users: ${delUsers.deletedCount}`);

    // 3. Ensure single clean Admin user exists
    let admin = await User.findOne({ role: 'ADMIN' });
    if (!admin) {
      admin = await User.create({
        name: 'Municipal Commissioner (Admin)',
        email: process.env.ADMIN_EMAIL || 'admin@swachh.gov.in',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        phone: '+91 98111 00001',
        role: 'ADMIN',
        ward: 'Metropolitan Headquarters',
        createdByName: 'System Commission',
      });
      console.log('Created fresh Admin user: admin@swachh.gov.in / admin123');
    } else {
      admin.name = 'Municipal Commissioner (Admin)';
      admin.email = process.env.ADMIN_EMAIL || 'admin@swachh.gov.in';
      admin.password = process.env.ADMIN_PASSWORD || 'admin123';
      admin.phone = '+91 98111 00001';
      admin.role = 'ADMIN';
      admin.ward = 'Metropolitan Headquarters';
      admin.allottedFacilities = [];
      await admin.save();
      console.log('Reset existing Admin user to standard credentials: admin@swachh.gov.in / admin123');
    }

    console.log('\n=======================================');
    console.log('🎉 DATABASE PURGE COMPLETED SUCCESSFULLY');
    console.log('--- Final Live Database Count ---');
    console.log('Users:     ', await User.countDocuments(), '(Role: ADMIN only)');
    console.log('Facilities:', await Facility.countDocuments());
    console.log('Complaints:', await Complaint.countDocuments());
    console.log('Tasks:     ', await Task.countDocuments());
    console.log('Staff:     ', await Staff.countDocuments());
    console.log('=======================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Purge error:', err);
    process.exit(1);
  }
}

purgeAllMockData();

