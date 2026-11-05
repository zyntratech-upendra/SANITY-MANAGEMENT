import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSanitation } from '../context/SanitationContext';
import VisitorReportPortal from '../components/VisitorReportPortal';

export default function VisitorKioskPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { facilities, submitCitizenComplaint } = useSanitation();

  return (
    <VisitorReportPortal
      facilities={facilities}
      initialFacilityCode={code?.toUpperCase() || ''}
      onBack={() => navigate('/command')}
      onSubmitSuccess={submitCitizenComplaint}
    />
  );
}

