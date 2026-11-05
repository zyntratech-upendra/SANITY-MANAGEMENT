const Task = require('../models/Task');
const Facility = require('../models/Facility');
const Staff = require('../models/Staff');
const Complaint = require('../models/Complaint');

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const { status, priority, staffId, workerId, leadId, facilityCode } = req.query;
    let query = {};

    if (status && status !== 'ALL') query.status = status;
    if (priority && priority !== 'ALL') query.priority = priority;
    if (facilityCode) query.facilityCode = facilityCode.toUpperCase();
    if (staffId) query['assignedStaff.staffId'] = staffId;
    if (workerId) {
      query.$or = [
        { 'assignedWorker.userId': workerId },
        { 'assignedStaff.staffId': workerId },
      ];
    }
    if (leadId) {
      query['assignedLead.userId'] = leadId;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new manual/maintenance task
const createTask = async (req, res) => {
  try {
    const io = req.app.get('io');
    const {
      facilityCode,
      title,
      type = 'CLEANING',
      priority = 'MEDIUM',
      assignedStaff,
      checklist = [],
      notes = '',
    } = req.body;

    const facility = await Facility.findOne({ code: facilityCode.toUpperCase() });
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });

    const taskId = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;

    const defaultChecklist =
      checklist.length > 0
        ? checklist
        : [
            { taskItem: 'Thorough sanitation & chemical wash', completed: false },
            { taskItem: 'Restock liquid soap and paper towels', completed: false },
            { taskItem: 'Inspect water tank level and plumbing', completed: false },
            { taskItem: 'Deodorize and sanitize high-touch handles', completed: false },
          ];

    const task = new Task({
      taskId,
      facilityId: facility._id,
      facilityCode: facility.code,
      facilityName: facility.name,
      title,
      type,
      priority,
      status: 'PENDING',
      source: 'MANUAL_DISPATCH',
      assignedStaff: assignedStaff || facility.assignedStaff,
      checklist: defaultChecklist,
      notes,
    });

    await task.save();

    if (io) {
      io.emit('task:created', task);
    }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// START cleaning task (Tracking start time)
const startTask = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { id } = req.params;
    const { staffName } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.status = 'IN_PROGRESS';
    task.startedAt = new Date();
    if (staffName) {
      task.assignedStaff.name = staffName;
    }
    await task.save();

    // Mark facility as CLEANING_IN_PROGRESS
    const facility = await Facility.findById(task.facilityId);
    if (facility) {
      facility.status.availability = 'CLEANING_IN_PROGRESS';
      await facility.save();
      if (io) io.emit('facility:updated', facility);
    }

    // Update staff status to BUSY
    if (task.assignedStaff?.staffId) {
      await Staff.findOneAndUpdate(
        { staffId: task.assignedStaff.staffId },
        { status: 'BUSY', activeTaskId: task.taskId }
      );
    }

    if (io) {
      io.emit('task:started', task);
    }

    res.json({ success: true, message: 'Task started. Cleaning timer initiated.', data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// COMPLETE cleaning task (Tracking completion duration & restoring facility status)
const completeTask = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { id } = req.params;
    const { notes, checklist, soapRefilled, waterRefilled } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const now = new Date();
    const started = task.startedAt ? new Date(task.startedAt) : new Date(now.getTime() - 15 * 60 * 1000);
    const duration = Math.max(1, Math.round((now.getTime() - started.getTime()) / 60000));

    task.status = 'COMPLETED';
    task.completedAt = now;
    task.durationMinutes = duration;
    if (notes) task.notes = (task.notes ? task.notes + ' | ' : '') + `Staff Completion: ${notes}`;

    if (checklist && Array.isArray(checklist)) {
      task.checklist = checklist;
    } else if (Array.isArray(task.checklist)) {
      // Mark all checklist items as completed
      task.checklist = task.checklist.map((item) => ({
        taskItem: item.taskItem || item,
        completed: true,
      }));
    }

    await task.save();

    // Update Facility status to Clean & Available
    const facility = await Facility.findById(task.facilityId);
    if (facility) {
      facility.status.availability = 'AVAILABLE';
      facility.status.cleanliness = 'EXCELLENT';
      facility.status.lastCleanedAt = now;
      facility.status.nextScheduledClean = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      facility.telemetry.odorLevelPpm = 8; // Reset odor to fresh air
      if (soapRefilled) facility.telemetry.soapLevel = 100;
      if (waterRefilled) facility.telemetry.waterLevel = 100;

      await facility.save();
      if (io) io.emit('facility:updated', facility);
    }

    // Resolve linked complaint if exists
    if (task.complaintId) {
      await Complaint.findByIdAndUpdate(task.complaintId, {
        status: 'RESOLVED',
        resolvedAt: now,
        resolutionNotes: `Resolved by staff ${task.assignedStaff.name} (Duration: ${duration} mins).`,
      });
      if (io) io.emit('complaint:resolved', { complaintId: task.complaintId, duration });
    }

    // Update Staff metrics
    if (task.assignedStaff?.staffId) {
      const staffMember = await Staff.findOne({ staffId: task.assignedStaff.staffId });
      if (staffMember) {
        staffMember.completedTasksCount = (staffMember.completedTasksCount || 0) + 1;
        staffMember.status = 'ON_DUTY';
        staffMember.activeTaskId = '';
        // Running average calculation
        const prevCount = staffMember.completedTasksCount - 1;
        staffMember.avgCleaningDurationMins = Math.round(
          ((staffMember.avgCleaningDurationMins || 20) * prevCount + duration) / staffMember.completedTasksCount
        );
        await staffMember.save();
      }
    }

    if (io) {
      io.emit('task:completed', { task, duration });
    }

    res.json({
      success: true,
      message: `Task completed in ${duration} minutes. Facility marked clean and available.`,
      data: task,
      durationMinutes: duration,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  startTask,
  completeTask,
};
