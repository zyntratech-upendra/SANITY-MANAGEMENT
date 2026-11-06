import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { socket } from '../services/socket';

const SanitationContext = createContext(null);

export const SanitationProvider = ({ children }) => {
  const [facilities, setFacilities] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [qrModalFacility, setQrModalFacility] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      const [facRes, compRes, taskRes, staffRes] = await Promise.all([
        api.getFacilities(),
        api.getComplaints(),
        api.getTasks(),
        api.getStaff(),
      ]);

      if (facRes?.data) setFacilities(facRes.data);
      if (compRes?.data) setComplaints(compRes.data);
      if (taskRes?.data) setTasks(taskRes.data);
      if (staffRes?.data) setStaffList(staffRes.data);
    } catch (err) {
      console.error('Failed to load sanitation data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time WebSocket listeners
  useEffect(() => {
    const handleComplaintNew = (payload) => {
      console.log('[Live Alert] Complaint received:', payload);
      if (payload.complaint) {
        setComplaints((prev) => [payload.complaint, ...prev.filter((c) => c._id !== payload.complaint._id)]);
      }
      if (payload.task) {
        setTasks((prev) => [payload.task, ...prev.filter((t) => t._id !== payload.task._id)]);
      }

      setLiveToast({
        title: `🚨 Urgent Citizen Alert: ${payload.facilityName}`,
        message: `Issue reported! Auto-maintenance task dispatched to duty staff.`,
        type: 'alert',
      });
      loadData();
    };

    const handleTaskCreated = (newTask) => {
      setTasks((prev) => [newTask, ...prev.filter((t) => t._id !== newTask._id)]);
    };

    const handleTaskStarted = (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      loadData();
    };

    const handleTaskCompleted = (data) => {
      const { task } = data;
      if (task) {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      }
      setLiveToast({
        title: `✅ Sanitation Verified: ${task?.facilityName || 'Facility'}`,
        message: `Cleaning completed in ${task?.durationMinutes || 15} mins. Restored to 100% clean.`,
        type: 'success',
      });
      loadData();
    };

    const handleFacilityUpdated = (updatedFacility) => {
      setFacilities((prev) => prev.map((f) => (f._id === updatedFacility._id ? updatedFacility : f)));
    };

    const handleFacilityCreated = (newFacility) => {
      setFacilities((prev) => [newFacility, ...prev]);
    };

    const handleFacilityDeleted = ({ id }) => {
      setFacilities((prev) => prev.filter((f) => f._id !== id));
    };

    const handleTelemetryUpdated = (telemetryData) => {
      setFacilities((prev) =>
        prev.map((f) => {
          if (f._id === telemetryData.facilityId) {
            return {
              ...f,
              telemetry: telemetryData.telemetry,
              status: telemetryData.status || f.status,
            };
          }
          return f;
        })
      );

      if (telemetryData.alert) {
        setLiveToast({
          title: `⚠️ IoT Threshold Triggered: ${telemetryData.code}`,
          message: `Automated incident remediation task dispatched.`,
          type: 'warning',
        });
        loadData();
      }
    };

    socket.on('complaint:new', handleComplaintNew);
    socket.on('task:created', handleTaskCreated);
    socket.on('task:started', handleTaskStarted);
    socket.on('task:completed', handleTaskCompleted);
    socket.on('facility:updated', handleFacilityUpdated);
    socket.on('facility:created', handleFacilityCreated);
    socket.on('facility:deleted', handleFacilityDeleted);
    socket.on('telemetry:updated', handleTelemetryUpdated);

    return () => {
      socket.off('complaint:new', handleComplaintNew);
      socket.off('task:created', handleTaskCreated);
      socket.off('task:started', handleTaskStarted);
      socket.off('task:completed', handleTaskCompleted);
      socket.off('facility:updated', handleFacilityUpdated);
      socket.off('facility:created', handleFacilityCreated);
      socket.off('facility:deleted', handleFacilityDeleted);
      socket.off('telemetry:updated', handleTelemetryUpdated);
    };
  }, [loadData]);

  // Operations Handlers
  const createFacility = async (payload) => {
    const res = await api.createFacility(payload);
    if (res?.data) {
      setFacilities((prev) => [res.data, ...prev]);
      setQrModalFacility(res.data);
    }
    return res;
  };

  const deleteFacility = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility record?')) return;
    await api.deleteFacility(id);
    setFacilities((prev) => prev.filter((f) => f._id !== id));
  };

  const quickClean = async (facility) => {
    await api.updateStaffStatus(facility._id, {
      availability: 'AVAILABLE',
      cleanliness: 'EXCELLENT',
      staffName: facility.assignedStaff?.name || 'Sanitation Team',
      notes: 'Quick sanitary reset logged via dashboard',
      soapLevel: 100,
      waterLevel: 95,
    });
    setLiveToast({
      title: `Sanitation Verified`,
      message: `${facility.name} marked as 5★ Clean and Available!`,
      type: 'success',
    });
    loadData();
  };

  const resolveComplaint = async (id, resolutionNotes) => {
    await api.resolveComplaint(id, { resolutionNotes });
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: 'RESOLVED', resolutionNotes } : c))
    );
    loadData();
  };

  const submitCitizenComplaint = async (payload) => {
    const res = await api.createComplaint(payload);
    loadData();
    return res;
  };

  const startTask = async (taskId, staffName) => {
    await api.startTask(taskId, { staffName });
    loadData();
  };

  const completeTask = async (taskId, data = {}) => {
    await api.completeTask(taskId, data);
    loadData();
  };

  const updateStaffStatus = async (id, data) => {
    await api.updateStaffStatus(id, data);
    loadData();
  };

  const simulateEvent = async (facilityId, eventType) => {
    await api.simulateSensor({ facilityId, eventType });
    loadData();
  };

  const updateTelemetry = async (facilityId, data) => {
    await api.updateTelemetry(facilityId, data);
  };

  return (
    <SanitationContext.Provider
      value={{
        facilities,
        complaints,
        tasks,
        staffList,
        selectedFacility,
        setSelectedFacility,
        qrModalFacility,
        setQrModalFacility,
        isRegisterOpen,
        setIsRegisterOpen,
        liveToast,
        setLiveToast,
        loadData,
        fetchFacilities: loadData,
        fetchTasks: loadData,
        fetchComplaints: loadData,
        fetchStaff: loadData,
        createFacility,
        deleteFacility,
        quickClean,
        resolveComplaint,
        submitCitizenComplaint,
        startTask,
        completeTask,
        updateStaffStatus,
        simulateEvent,
        updateTelemetry,
      }}
    >
      {children}
    </SanitationContext.Provider>
  );
};

export const useSanitation = () => {
  const context = useContext(SanitationContext);
  if (!context) {
    throw new Error('useSanitation must be used within a SanitationProvider');
  }
  return context;
};

