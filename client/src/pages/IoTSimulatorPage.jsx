import React from 'react';
import { useSanitation } from '../context/SanitationContext';
import IoTSimulatorView from '../components/IoTSimulatorView';

export default function IoTSimulatorPage() {
  const { facilities, simulateEvent, updateTelemetry } = useSanitation();

  return (
    <IoTSimulatorView
      facilities={facilities}
      onSimulateEvent={simulateEvent}
      onUpdateTelemetry={updateTelemetry}
    />
  );
}

