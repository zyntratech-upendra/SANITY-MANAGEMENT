import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

// Standard Haversine distance calculator in Kilometers
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
};

export const LocationProvider = ({ children }) => {
  // Default fallback coordinates: Central Sector, Rajamahendravaram
  const DEFAULT_COORDS = { lat: 16.9942, lng: 81.7766 };

  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem('swachh_user_gps');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If stale Delhi test coordinates, discard and reset to Rajamahendravaram
        if (parsed.lat > 20) {
          localStorage.setItem('swachh_user_gps', JSON.stringify(DEFAULT_COORDS));
          return DEFAULT_COORDS;
        }
        return parsed;
      }
      return DEFAULT_COORDS;
    } catch {
      return DEFAULT_COORDS;
    }
  });

  const [hasLiveGps, setHasLiveGps] = useState(false);
  const [accuracyMeters, setAccuracyMeters] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  // Request browser location
  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(newCoords);
        setAccuracyMeters(Math.round(position.coords.accuracy));
        setHasLiveGps(true);
        setPermissionState('granted');
        setIsLocating(false);

        try {
          localStorage.setItem('swachh_user_gps', JSON.stringify(newCoords));
        } catch (e) {
          console.warn('Failed to save GPS cache', e);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setIsLocating(false);
        setPermissionState(error.code === 1 ? 'denied' : 'prompt');
        setLocationError(
          error.code === 1
            ? 'Location permission denied. Using municipal city center default.'
            : 'Unable to acquire precise GPS signal. Using municipal default.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Try checking permissions on mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionState(result.state);
          if (result.state === 'granted') {
            requestLocation();
          }
          result.onchange = () => {
            setPermissionState(result.state);
            if (result.state === 'granted') requestLocation();
          };
        })
        .catch(() => {});
    }
  }, []);

  const getDistanceToFacility = (facility) => {
    if (!facility?.location?.lat || !facility?.location?.lng) return null;
    return calculateDistanceKm(coords.lat, coords.lng, facility.location.lat, facility.location.lng);
  };

  const sortFacilitiesByProximity = (facilitiesList = []) => {
    return [...facilitiesList].sort((a, b) => {
      const distA = getDistanceToFacility(a) ?? 9999;
      const distB = getDistanceToFacility(b) ?? 9999;
      return distA - distB;
    });
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        hasLiveGps,
        accuracyMeters,
        isLocating,
        locationError,
        permissionState,
        requestLocation,
        getDistanceToFacility,
        sortFacilitiesByProximity,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationCoords = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationCoords must be used within a LocationProvider');
  }
  return context;
};

