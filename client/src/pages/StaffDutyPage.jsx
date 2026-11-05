import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSanitation } from '../context/SanitationContext';
import StaffPortal from '../components/StaffPortal';

export default function StaffDutyPage() {
  const navigate = useNavigate();
  const {
    facilities,
    staffList,
    tasks,
    startTask,
    completeTask,
    updateStaffStatus,
  } = useSanitation();

  return (
    <StaffPortal
      facilities={facilities}
      staffList={staffList}
      tasks={tasks}
      onStartTask={startTask}
      onCompleteTask={completeTask}
      onUpdateFacilityStatus={updateStaffStatus}
      onBack={() => navigate('/command')}
    />
  );
}

