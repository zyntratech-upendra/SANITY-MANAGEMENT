import React from 'react';
import { useSanitation } from '../context/SanitationContext';
import ComplaintsView from '../components/ComplaintsView';

export default function ComplaintsPage() {
  const { complaints, resolveComplaint } = useSanitation();

  return (
    <ComplaintsView
      complaints={complaints}
      onResolveComplaint={resolveComplaint}
    />
  );
}

