const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Facility = require('../models/Facility');
const User = require('../models/User');

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

const godavariFacilities = [
  {
    code: 'TOILET-101',
    name: 'Pushkar Ghat Main Pilgrim Sanitation Hub',
    buildingName: 'Pushkar Ghat Holy Riverfront Pavilion',
    zone: 'Pushkar Ghat Sector',
    address: 'Pushkar Ghat Road, Godavari Bund, Rajamahendravaram - 533101',
    location: { lat: 16.9942, lng: 81.7766 },
    type: 'Male/Female Separate',
    blocks: [
      { blockName: 'Male Section (Stalls & Urinals)', type: 'Male', stallsCount: 5, urinalsCount: 6 },
      { blockName: 'Female Section (Private Cabins)', type: 'Female', stallsCount: 6, urinalsCount: 0 },
      { blockName: 'Divyang / Accessible & Baby Care', type: 'Accessible', stallsCount: 2, urinalsCount: 0 },
    ],
    totalStallsCount: 19,
    features: { accessible: true, babyCare: true, sanitaryVending: true, touchlessSensors: true },
    operatingHours: '24/7',
    status: {
      availability: 'AVAILABLE',
      cleanliness: 'EXCELLENT',
      lastCleanedAt: new Date(Date.now() - 25 * 60 * 1000),
      nextScheduledClean: new Date(Date.now() + 3 * 60 * 60 * 1000),
    },
    telemetry: {
      waterLevel: 96,
      odorLevelPpm: 9,
      isOccupied: false,
      footfallCountToday: 340,
      soapLevel: 92,
      paperLevel: 88,
      sensorOnline: true,
      lastSensorUpdate: new Date(),
    },
    ratings: { average: 4.9, count: 86 },
  },
  {
    code: 'TOILET-102',
    name: 'Kotilingala Ghat High-Footfall Sanitation Complex',
    buildingName: 'Kotilingeswara Swamy Sacred Concourse',
    zone: 'Kotilingala Ghat Sector',
    address: 'Kotilingala Temple Road, Godavari Riverfront, Rajamahendravaram',
    location: { lat: 17.0015, lng: 81.7712 },
    type: 'Accessible/Family',
    blocks: [
      { blockName: 'Pilgrim Holy Bathing Changing Stalls', type: 'All-Gender', stallsCount: 8, urinalsCount: 4 },
      { blockName: 'Accessible Divyang Pavilion', type: 'Accessible', stallsCount: 2, urinalsCount: 0 },
    ],
    totalStallsCount: 14,
    features: { accessible: true, babyCare: true, sanitaryVending: true, touchlessSensors: true },
    operatingHours: '24/7',
    status: {
      availability: 'OCCUPIED',
      cleanliness: 'EXCELLENT',
      lastCleanedAt: new Date(Date.now() - 45 * 60 * 1000),
      nextScheduledClean: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
    telemetry: {
      waterLevel: 88,
      odorLevelPpm: 12,
      isOccupied: true,
      footfallCountToday: 290,
      soapLevel: 80,
      paperLevel: 74,
      sensorOnline: true,
      lastSensorUpdate: new Date(),
    },
    ratings: { average: 4.8, count: 62 },
  },
  {
    code: 'TOILET-103',
    name: 'Saraswati Ghat & VIP Enclosure Smart Restroom Pod',
    buildingName: 'Saraswati Ghat Protocol & VIP Pavilion',
    zone: 'Riverfront North VIP Sector',
    address: 'Saraswati Ghat Approach Road, Godavari Bund, Rajamahendravaram',
    location: { lat: 16.9912, lng: 81.7788 },
    type: 'Smart Automated Pod',
    blocks: [
      { blockName: 'Touchless Automated Smart Pods', type: 'All-Gender', stallsCount: 3, urinalsCount: 1 },
      { blockName: 'Divyang Assisted Access Stall', type: 'Accessible', stallsCount: 1, urinalsCount: 0 },
    ],
    totalStallsCount: 5,
    features: { accessible: true, babyCare: true, sanitaryVending: true, touchlessSensors: true },
    operatingHours: '24/7',
    status: {
      availability: 'CLEANING_IN_PROGRESS',
      cleanliness: 'SATISFACTORY',
      lastCleanedAt: new Date(Date.now() - 120 * 60 * 1000),
      nextScheduledClean: new Date(Date.now() + 30 * 60 * 1000),
    },
    telemetry: {
      waterLevel: 74,
      odorLevelPpm: 22,
      isOccupied: false,
      footfallCountToday: 110,
      soapLevel: 65,
      paperLevel: 60,
      sensorOnline: true,
      lastSensorUpdate: new Date(),
    },
    ratings: { average: 4.5, count: 39 },
  },
  {
    code: 'TOILET-104',
    name: 'Markandeya Ghat Pilgrim Restroom Complex',
    buildingName: 'Markandeya Swamy Ghat Pilgrim Pavilion',
    zone: 'Riverfront South Sector',
    address: 'Near Markandeya Swamy Temple, Godavari Bund, Rajamahendravaram',
    location: { lat: 16.9978, lng: 81.7735 },
    type: 'Male/Female Separate',
    blocks: [
      { blockName: 'Pilgrim Male Concourse', type: 'Male', stallsCount: 6, urinalsCount: 8 },
      { blockName: 'Pilgrim Female Concourse', type: 'Female', stallsCount: 6, urinalsCount: 0 },
      { blockName: 'Divyang Wheelchair Unit', type: 'Accessible', stallsCount: 2, urinalsCount: 0 },
    ],
    totalStallsCount: 22,
    features: { accessible: true, babyCare: true, sanitaryVending: false, touchlessSensors: true },
    operatingHours: '04:00 - 23:00',
    status: {
      availability: 'MAINTENANCE_REQUIRED',
      cleanliness: 'CRITICAL_UNHYGIENIC',
      lastCleanedAt: new Date(Date.now() - 280 * 60 * 1000),
      nextScheduledClean: new Date(Date.now() - 15 * 60 * 1000),
    },
    telemetry: {
      waterLevel: 16,
      odorLevelPpm: 54,
      isOccupied: false,
      footfallCountToday: 410,
      soapLevel: 12,
      paperLevel: 14,
      sensorOnline: true,
      lastSensorUpdate: new Date(),
    },
    ratings: { average: 3.4, count: 95 },
  },
  {
    code: 'TOILET-105',
    name: 'Rajamahendravaram Central Railway Station Gateway',
    buildingName: 'Rajahmundry Junction Passenger Concourse',
    zone: 'Railway Transit Hub Ward',
    address: 'Platform 1 Circulating Area, Rajamahendravaram Junction (RJY)',
    location: { lat: 17.0050, lng: 81.7820 },
    type: 'All-Gender',
    blocks: [
      { blockName: 'Passenger Bio-Toilets (North Wing)', type: 'Male', stallsCount: 4, urinalsCount: 4 },
      { blockName: 'Passenger Bio-Toilets (South Wing)', type: 'Female', stallsCount: 4, urinalsCount: 0 },
      { blockName: 'Accessible Divyang Unit', type: 'Accessible', stallsCount: 2, urinalsCount: 0 },
    ],
    totalStallsCount: 14,
    features: { accessible: true, babyCare: true, sanitaryVending: true, touchlessSensors: true },
    operatingHours: '24/7',
    status: {
      availability: 'AVAILABLE',
      cleanliness: 'EXCELLENT',
      lastCleanedAt: new Date(Date.now() - 40 * 60 * 1000),
      nextScheduledClean: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
    },
    telemetry: {
      waterLevel: 92,
      odorLevelPpm: 14,
      isOccupied: false,
      footfallCountToday: 520,
      soapLevel: 85,
      paperLevel: 80,
      sensorOnline: true,
      lastSensorUpdate: new Date(),
    },
    ratings: { average: 4.7, count: 112 },
  },
  {
    code: 'TOILET-106',
    name: 'Morampudi RTC Bus Complex Terminal Restrooms',
    buildingName: 'APSRTC Pushkaralu Transit Concourse',
    zone: 'Highway Transit Ward',
    address: 'APSRTC Bus Station Complex, Morampudi Junction, Rajamahendravaram',
    location: { lat: 16.9850, lng: 81.8020 },
    type: 'Male/Female Separate',
    blocks: [
      { blockName: 'Intercity Pilgrim Concourse (Male)', type: 'Male', stallsCount: 6, urinalsCount: 8 },
      { blockName: 'Intercity Pilgrim Concourse (Female)', type: 'Female', stallsCount: 6, urinalsCount: 0 },
      { blockName: 'Special Needs & Baby Care Pavilion', type: 'Accessible', stallsCount: 2, urinalsCount: 0 },
    ],
    totalStallsCount: 22,
    features: { accessible: true, babyCare: true, sanitaryVending: true, touchlessSensors: true },
    operatingHours: '24/7',
    status: {
      availability: 'AVAILABLE',
      cleanliness: 'NEEDS_ATTENTION',
      lastCleanedAt: new Date(Date.now() - 190 * 60 * 1000),
      nextScheduledClean: new Date(Date.now() + 20 * 60 * 1000),
    },
    telemetry: {
      waterLevel: 50,
      odorLevelPpm: 32,
      isOccupied: true,
      footfallCountToday: 480,
      soapLevel: 38,
      paperLevel: 32,
      sensorOnline: true,
      lastSensorUpdate: new Date(),
    },
    ratings: { average: 3.9, count: 77 },
  },
];

async function updateGhats() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Pushkaralu Seeder] Connected to MongoDB Atlas.');

    const leadUser = await User.findOne({ role: 'MUNICIPAL_LEAD' });
    const workerUser = await User.findOne({ role: 'WORKER' });

    for (const f of godavariFacilities) {
      const qrDataUrl = await QRCode.toDataURL(`${clientUrl}/report/${f.code}`, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 320,
        color: { dark: '#0f172a', light: '#ffffff' },
      });

      const updateData = {
        ...f,
        qrCodeData: qrDataUrl,
        assignedLead: leadUser
          ? { userId: leadUser._id, name: leadUser.name, email: leadUser.email }
          : { name: 'RMC Pushkaralu Zonal Lead' },
        assignedWorker: workerUser
          ? { userId: workerUser._id, name: workerUser.name, phone: workerUser.phone }
          : { name: 'Rajesh Kumar (Ghat Specialist)' },
        assignedStaff: workerUser
          ? { staffId: workerUser._id.toString(), name: workerUser.name, phone: workerUser.phone }
          : undefined,
      };

      await Facility.findOneAndUpdate({ code: f.code }, updateData, { upsert: true, new: true });
      console.log(`[Pushkaralu Seeder] Updated ${f.code}: ${f.name} at [${f.location.lat}, ${f.location.lng}]`);
    }

    console.log('[Pushkaralu Seeder] All 6 Rajamahendravaram Godavari Pushkaralu 2027 Ghats updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Pushkaralu Seeder] Error:', err);
    process.exit(1);
  }
}

updateGhats();
