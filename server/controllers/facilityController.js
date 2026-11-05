const Facility = require('../models/Facility');
const QRCode = require('qrcode');

// Generate QR code for a facility
const generateQR = async (code) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const targetUrl = `${clientUrl}/report/${code}`;
  try {
    return await QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR Generation failed:', err);
    return '';
  }
};

// GET all facilities
const getFacilities = async (req, res) => {
  try {
    const { zone, status, search, leadId, workerId } = req.query;
    let query = {};

    if (zone && zone !== 'ALL') {
      query.zone = zone;
    }
    if (status && status !== 'ALL') {
      query['status.availability'] = status;
    }
    if (leadId) {
      query['assignedLead.userId'] = leadId;
    }
    if (workerId) {
      query.$or = [
        { 'assignedWorker.userId': workerId },
        { 'assignedStaff.staffId': workerId },
      ];
    }
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { address: searchRegex },
        { buildingName: searchRegex },
      ];
    }

    const facilities = await Facility.find(query).sort({ updatedAt: -1 });
    res.json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET facility by ID or Code
const getFacility = async (req, res) => {
  try {
    const { idOrCode } = req.params;
    let facility;

    if (idOrCode.startsWith('TOILET-') || idOrCode.startsWith('FAC-')) {
      facility = await Facility.findOne({ code: idOrCode.toUpperCase() });
    } else if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      facility = await Facility.findById(idOrCode);
    } else {
      facility = await Facility.findOne({ code: idOrCode.toUpperCase() });
    }

    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new facility
const createFacility = async (req, res) => {
  try {
    const io = req.app.get('io');
    const {
      name,
      buildingName,
      zone,
      address,
      location,
      type,
      blocks,
      stallsCount,
      features,
      operatingHours,
      assignedLead,
      assignedWorker,
      assignedStaff,
    } = req.body;

    // Generate unique code if not provided
    let code = req.body.code ? req.body.code.toUpperCase().trim() : '';
    if (!code) {
      const count = await Facility.countDocuments();
      code = `TOILET-${String(count + 101).padStart(3, '0')}`;
    }

    // Check code uniqueness
    const existing = await Facility.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: `Facility with code ${code} already exists.` });
    }

    const qrCodeData = await generateQR(code);

    // Default blocks if none provided
    const facilityBlocks = blocks && blocks.length > 0 ? blocks : [
      { blockName: 'Male Section', type: 'Male', stallsCount: stallsCount?.male || 3, urinalsCount: 3 },
      { blockName: 'Female Section', type: 'Female', stallsCount: stallsCount?.female || 4, urinalsCount: 0 },
      { blockName: 'Divyang / Accessible Stall', type: 'Accessible', stallsCount: stallsCount?.accessible || 1, urinalsCount: 0 },
    ];

    const totalStalls = facilityBlocks.reduce((acc, b) => acc + (Number(b.stallsCount) || 0) + (Number(b.urinalsCount) || 0), 0);

    const facility = new Facility({
      code,
      name,
      buildingName: buildingName || 'Main Public Complex',
      zone: zone || 'Central Ward',
      address,
      location: location || { lat: 28.6139, lng: 77.2090 },
      type: type || 'Male/Female Separate',
      blocks: facilityBlocks,
      totalStallsCount: totalStalls,
      stallsCount: stallsCount || { male: 3, female: 4, accessible: 1 },
      features: features || { accessible: true, babyCare: true, sanitaryVending: true, touchlessSensors: true },
      operatingHours: operatingHours || '24/7',
      assignedLead: assignedLead || { userId: null, name: 'Unassigned Ward Lead', email: '' },
      assignedWorker: assignedWorker || { userId: null, name: assignedStaff?.name || 'Unassigned Field Worker', phone: assignedStaff?.phone || '' },
      assignedStaff: assignedStaff || { staffId: assignedWorker?.userId?.toString() || '', name: assignedWorker?.name || 'Unassigned', phone: assignedWorker?.phone || '' },
      qrCodeData,
      status: {
        availability: 'AVAILABLE',
        cleanliness: 'EXCELLENT',
        lastCleanedAt: new Date(),
        nextScheduledClean: new Date(Date.now() + 4 * 60 * 60 * 1000),
      },
      telemetry: {
        waterLevel: 92,
        odorLevelPpm: 12,
        isOccupied: false,
        footfallCountToday: 0,
        soapLevel: 95,
        paperLevel: 85,
        sensorOnline: true,
        lastSensorUpdate: new Date(),
      },
    });

    await facility.save();

    if (io) {
      io.emit('facility:created', facility);
    }

    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE facility general details
const updateFacility = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { id } = req.params;

    const facility = await Facility.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    if (io) {
      io.emit('facility:updated', facility);
    }

    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// SANITATION STAFF updates facility cleanliness & availability
const updateStaffStatus = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { id } = req.params;
    const { availability, cleanliness, staffName, notes, soapLevel, waterLevel } = req.body;

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    if (availability) facility.status.availability = availability;
    if (cleanliness) facility.status.cleanliness = cleanliness;

    if (cleanliness === 'EXCELLENT' || availability === 'AVAILABLE') {
      facility.status.lastCleanedAt = new Date();
      facility.status.nextScheduledClean = new Date(Date.now() + 4 * 60 * 60 * 1000);
      // Reset telemetry odor
      facility.telemetry.odorLevelPpm = 10;
    }

    if (soapLevel !== undefined) facility.telemetry.soapLevel = soapLevel;
    if (waterLevel !== undefined) facility.telemetry.waterLevel = waterLevel;

    await facility.save();

    if (io) {
      io.emit('facility:status_updated', {
        facility,
        staffName,
        notes,
        timestamp: new Date(),
      });
    }

    res.json({
      success: true,
      message: 'Facility sanitation status updated successfully',
      data: facility,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE facility
const deleteFacility = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { id } = req.params;

    const facility = await Facility.findByIdAndDelete(id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    if (io) {
      io.emit('facility:deleted', { id });
    }

    res.json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  updateStaffStatus,
  deleteFacility,
  generateQR,
};

