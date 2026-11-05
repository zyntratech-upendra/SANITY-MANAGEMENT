import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSanitation } from '../context/SanitationContext';
import FacilityList from '../components/FacilityList';

export default function FacilitiesPage() {
  const navigate = useNavigate();
  const {
    facilities,
    setIsRegisterOpen,
    setQrModalFacility,
    setSelectedFacility,
    deleteFacility,
    quickClean,
  } = useSanitation();

  return (
    <FacilityList
      facilities={facilities}
      onOpenRegister={() => setIsRegisterOpen(true)}
      onOpenQR={(facility) => setQrModalFacility(facility)}
      onOpenReport={(code) => navigate(`/report/${code}`)}
      onViewOnMap={(facility) => {
        setSelectedFacility(facility);
        navigate('/map');
      }}
      onDeleteFacility={deleteFacility}
      onQuickClean={quickClean}
    />
  );
}
