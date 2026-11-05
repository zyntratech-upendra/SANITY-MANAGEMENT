const Complaint = require('../models/Complaint');
const Facility = require('../models/Facility');
const Task = require('../models/Task');
const Staff = require('../models/Staff');

// CREATE citizen complaint + AUTOMATICALLY CREATE MAINTENANCE TASK
const createComplaint = async (req, res) => {
  try {
    const io = req.app.get('io');
    const {
      facilityCode,
      targetBlock = 'Entire Sanitation Center',
      rating,
      issues = [],
      description = '',
      imageUrl = '',
      reporterName = 'Anonymous Visitor',
      reporterPhone = '',
      reporterEmail = '',
      citizenId,
    } = req.body;

    // Find target facility
    const facility = await Facility.findOne({ code: facilityCode.toUpperCase() });
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found for code: ' + facilityCode });
    }

    // Determine priority based on rating and issue severity
    let priority = 'MEDIUM';
    const isUrgent =
      Number(rating) <= 2 ||
      issues.includes('NO_WATER') ||
      issues.includes('CLOGGED_FLUSH') ||
      issues.includes('FOUL_ODOR');

    if (isUrgent) {
      priority = Number(rating) === 1 ? 'URGENT' : 'HIGH';
    }

    // Generate unique Ticket ID
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    // Select assigned worker or fallback
    const assignedWorker = facility.assignedWorker?.userId
      ? facility.assignedWorker
      : {
          userId: null,
          name: facility.assignedStaff?.name || 'On-Duty Sanitizer',
          phone: facility.assignedStaff?.phone || '',
        };

    const assignedLead = facility.assignedLead?.name ? facility.assignedLead : { name: 'Ward Municipal Lead' };

    let assignedStaff = {
      staffId: assignedWorker.userId?.toString() || facility.assignedStaff?.staffId || 'STF-01',
      name: assignedWorker.name || facility.assignedStaff?.name || 'Duty Supervisor',
      phone: assignedWorker.phone || facility.assignedStaff?.phone || '',
    };

    // 1. Create Complaint
    const complaint = new Complaint({
      ticketId,
      facilityId: facility._id,
      facilityCode: facility.code,
      facilityName: facility.name,
      targetBlock,
      citizenId: citizenId || (req.user ? req.user._id : null),
      rating: Number(rating),
      issues,
      description,
      imageUrl,
      reporterName,
      reporterPhone,
      reporterEmail,
      priority,
      status: 'ASSIGNED',
      assignedWorkerName: assignedWorker.name,
      assignedLeadName: assignedLead.name,
      assignedStaffName: assignedStaff.name,
    });

    await complaint.save();

    // 2. Automatically determine task type & checklist
    let taskType = 'CLEANING';
    if (issues.includes('NO_WATER') || issues.includes('CLOGGED_FLUSH')) {
      taskType = 'PLUMBING_WATER';
    } else if (issues.includes('NO_SOAP_SANITIZER') || issues.includes('NO_TOILET_PAPER')) {
      taskType = 'DISPENSER_REFILL';
    } else if (issues.includes('BROKEN_LIGHTING_OR_DOOR')) {
      taskType = 'ELECTRICAL';
    }

    const checklistItems = [
      { taskItem: `Inspect target block: ${targetBlock}`, completed: false },
      { taskItem: 'Perform sanitary scrub and disinfection', completed: false },
      { taskItem: 'Replenish consumables (Soap, Paper, Sanitizer)', completed: false },
      { taskItem: 'Verify water supply pressure & flush mechanism', completed: false },
      { taskItem: 'Log air freshening / odor clearance check', completed: false },
    ];

    const taskId = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
    const task = new Task({
      taskId,
      facilityId: facility._id,
      facilityCode: facility.code,
      facilityName: facility.name,
      targetBlock,
      title: `[Ticket ${ticketId}] ${targetBlock} - ${issues.join(', ') || 'Cleanliness Grievance'}`,
      type: taskType,
      priority,
      status: 'PENDING',
      source: 'CITIZEN_COMPLAINT',
      complaintId: complaint._id,
      assignedWorker,
      assignedLead,
      assignedStaff,
      checklist: checklistItems,
      notes: description ? `Visitor feedback: "${description}"` : `Triggered via QR scan for ${targetBlock}.`,
    });

    await task.save();

    // Update complaint with linked task ID
    complaint.generatedTaskId = task._id;
    await complaint.save();

    // 3. Update Facility Cleanliness status to reflect alert
    if (Number(rating) <= 2) {
      facility.status.cleanliness = 'CRITICAL_UNHYGIENIC';
      facility.status.availability = 'MAINTENANCE_REQUIRED';
    } else {
      facility.status.cleanliness = 'NEEDS_ATTENTION';
    }

    // Recalculate average rating
    const totalCount = (facility.ratings.count || 0) + 1;
    const newAvg = Number(
      (((facility.ratings.average || 4.5) * (facility.ratings.count || 0) + Number(rating)) / totalCount).toFixed(1)
    );
    facility.ratings = {
      average: newAvg,
      count: totalCount,
    };

    await facility.save();

    // 4. Emit live alerts over Socket.IO
    if (io) {
      io.emit('complaint:new', {
        complaint,
        task,
        facilityCode: facility.code,
        facilityName: facility.name,
        targetBlock,
        priority,
      });

      io.emit('task:created', task);
      io.emit('facility:updated', facility);
    }

    res.status(201).json({
      success: true,
      message: 'Citizen feedback received and maintenance task automatically dispatched!',
      ticketId,
      complaint,
      task,
    });
  } catch (error) {
    console.error('Error in createComplaint:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all complaints
const getComplaints = async (req, res) => {
  try {
    const { status, priority, facilityCode, citizenId, facilityId } = req.query;
    let query = {};

    if (status && status !== 'ALL') query.status = status;
    if (priority && priority !== 'ALL') query.priority = priority;
    if (facilityCode) query.facilityCode = facilityCode.toUpperCase();
    if (citizenId) query.citizenId = citizenId;
    if (facilityId) query.facilityId = facilityId;

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// RESOLVE complaint
const resolveComplaint = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = 'RESOLVED';
    complaint.resolvedAt = new Date();
    complaint.resolutionNotes = resolutionNotes || 'Resolved by sanitation supervisor';
    await complaint.save();

    if (io) {
      io.emit('complaint:resolved', complaint);
    }

    res.json({ success: true, message: 'Complaint marked as resolved', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  resolveComplaint,
};

