import React from 'react';
import { useSanitation } from '../context/SanitationContext';
import StaffTasksView from '../components/StaffTasksView';

export default function StaffTasksPage() {
  const { tasks, staffList, startTask, completeTask } = useSanitation();

  return (
    <StaffTasksView
      tasks={tasks}
      staffList={staffList}
      onStartTask={startTask}
      onCompleteTask={completeTask}
      onOpenCreateTask={() => {}}
    />
  );
}

