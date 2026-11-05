const Facility = require('../models/Facility');
const Task = require('../models/Task');

// Update IoT Sensor telemetry for a specific facility
const updateTelemetry = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { id } = req.params;
    const { waterLevel, odorLevelPpm, isOccupied, soapLevel, paperLevel } = req.body;

    const facility = await Facility.findById(id);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });

    if (waterLevel !== undefined) facility.telemetry.waterLevel = Number(waterLevel);
    if (odorLevelPpm !== undefined) facility.telemetry.odorLevelPpm = Number(odorLevelPpm);
    if (isOccupied !== undefined) {
      facility.telemetry.isOccupied = Boolean(isOccupied);
      if (facility.status.availability === 'AVAILABLE' && isOccupied) {
        facility.status.availability = 'OCCUPIED';
      } else if (facility.status.availability === 'OCCUPIED' && !isOccupied) {
        facility.status.availability = 'AVAILABLE';
      }
    }
    if (soapLevel !== undefined) facility.telemetry.soapLevel = Number(soapLevel);
    if (paperLevel !== undefined) facility.telemetry.paperLevel = Number(paperLevel);

    facility.telemetry.lastSensorUpdate = new Date();

    // Check automated threshold triggers
    let triggeredAlert = null;

    // Critical Water Drop (< 20%)
    if (facility.telemetry.waterLevel <= 20) {
      facility.status.availability = 'MAINTENANCE_REQUIRED';
      // Check if open task already exists
      const existingTask = await Task.findOne({
        facilityId: facility._id,
        type: 'PLUMBING_WATER',
        status: { $in: ['PENDING', 'IN_PROGRESS'] },
      });

      if (!existingTask) {
        const taskId = `TSK-IOT-${Math.floor(1000 + Math.random() * 9000)}`;
        const task = new Task({
          taskId,
          facilityId: facility._id,
          facilityCode: facility.code,
          facilityName: facility.name,
          title: `[IoT Sensor Alert] Low Water Reservoir (${facility.telemetry.waterLevel}%)`,
          type: 'PLUMBING_WATER',
          priority: 'URGENT',
          status: 'PENDING',
          source: 'IOT_AUTO_TRIGGER',
          assignedStaff: facility.assignedStaff,
          checklist: [
            { taskItem: 'Inspect main water pump and inlet valve', completed: false },
            { taskItem: 'Verify secondary reservoir levels', completed: false },
            { taskItem: 'Refill overhead tank and restore water pressure', completed: false },
          ],
          notes: 'Automated trigger: Water sensor detected level below threshold.',
        });
        await task.save();
        triggeredAlert = { type: 'WATER_CRITICAL', task };
        if (io) io.emit('task:created', task);
      }
    }

    // High Odor / Ammonia sensor spike (> 45 PPM)
    if (facility.telemetry.odorLevelPpm >= 45) {
      facility.status.cleanliness = 'NEEDS_ATTENTION';
      const existingOdorTask = await Task.findOne({
        facilityId: facility._id,
        type: 'CLEANING',
        status: { $in: ['PENDING', 'IN_PROGRESS'] },
      });

      if (!existingOdorTask) {
        const taskId = `TSK-IOT-${Math.floor(1000 + Math.random() * 9000)}`;
        const task = new Task({
          taskId,
          facilityId: facility._id,
          facilityCode: facility.code,
          facilityName: facility.name,
          title: `[IoT Sensor Alert] Odor / Air Quality Spike (${facility.telemetry.odorLevelPpm} PPM)`,
          type: 'CLEANING',
          priority: 'HIGH',
          status: 'PENDING',
          source: 'IOT_AUTO_TRIGGER',
          assignedStaff: facility.assignedStaff,
          checklist: [
            { taskItem: 'Disinfect urinals and floor drain traps', completed: false },
            { taskItem: 'Activate forced ventilation / exhaust system', completed: false },
            { taskItem: 'Dispense odor neutralizer / fresh fragrance', completed: false },
          ],
          notes: 'Automated trigger: Ammonia air quality sensor detected odor threshold violation.',
        });
        await task.save();
        triggeredAlert = { type: 'ODOR_SPIKE', task };
        if (io) io.emit('task:created', task);
      }
    }

    // Low Soap (< 15%)
    if (facility.telemetry.soapLevel <= 15) {
      const existingSoapTask = await Task.findOne({
        facilityId: facility._id,
        type: 'DISPENSER_REFILL',
        status: { $in: ['PENDING', 'IN_PROGRESS'] },
      });

      if (!existingSoapTask) {
        const taskId = `TSK-IOT-${Math.floor(1000 + Math.random() * 9000)}`;
        const task = new Task({
          taskId,
          facilityId: facility._id,
          facilityCode: facility.code,
          facilityName: facility.name,
          title: `[IoT Sensor Alert] Empty Soap Dispenser (${facility.telemetry.soapLevel}%)`,
          type: 'DISPENSER_REFILL',
          priority: 'MEDIUM',
          status: 'PENDING',
          source: 'IOT_AUTO_TRIGGER',
          assignedStaff: facility.assignedStaff,
          checklist: [
            { taskItem: 'Refill antibacterial handwash dispensers', completed: false },
            { taskItem: 'Test touchless optical dispenser nozzle', completed: false },
          ],
          notes: 'Automated trigger: Soap sensor below minimum capacity.',
        });
        await task.save();
        triggeredAlert = { type: 'SOAP_LOW', task };
        if (io) io.emit('task:created', task);
      }
    }

    await facility.save();

    if (io) {
      io.emit('telemetry:updated', {
        facilityId: facility._id,
        code: facility.code,
        telemetry: facility.telemetry,
        status: facility.status,
        alert: triggeredAlert,
      });
    }

    res.json({
      success: true,
      message: 'Telemetry updated successfully',
      data: facility.telemetry,
      status: facility.status,
      triggeredAlert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Simulate sensor condition quickly for demo/testing
const simulateSensorEvent = async (req, res) => {
  try {
    const { facilityId, eventType } = req.body;
    const facility = await Facility.findById(facilityId);
    if (!facility) return res.status(404).json({ success: false, message: 'Facility not found' });

    let updates = {};
    if (eventType === 'LOW_WATER') {
      updates = { waterLevel: 12 };
    } else if (eventType === 'ODOR_SPIKE') {
      updates = { odorLevelPpm: 58 };
    } else if (eventType === 'EMPTY_SOAP') {
      updates = { soapLevel: 8 };
    } else if (eventType === 'TOGGLE_OCCUPANCY') {
      updates = { isOccupied: !facility.telemetry.isOccupied };
    } else if (eventType === 'RESTORE_ALL_GOOD') {
      updates = { waterLevel: 95, odorLevelPpm: 12, soapLevel: 90, isOccupied: false };
      facility.status.availability = 'AVAILABLE';
      facility.status.cleanliness = 'EXCELLENT';
      await facility.save();
    }

    // Call updateTelemetry logic with params.id set
    req.params = { id: facilityId };
    req.body = updates;
    return updateTelemetry(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateTelemetry,
  simulateSensorEvent,
};
