import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { realtimeDb } from '../firebase';

const initialSensorState = {
  air_quality: 0,
  humidity: 0,
  sound: 0,
  temperature: 0
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizePayload = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return initialSensorState;
  }

  const data = raw.latest && typeof raw.latest === 'object' ? raw.latest : raw;

  return {
    air_quality: toNumber(data.air_quality ?? data.airQuality ?? data.aqi),
    humidity: toNumber(data.humidity ?? data.hum),
    sound: toNumber(data.sound ?? data.breathingSound ?? data.noise),
    temperature: toNumber(data.temperature ?? data.temp ?? data.temperature_c)
  };
};

const hasAnySensorValue = (data) => {
  return [data.air_quality, data.humidity, data.sound, data.temperature].some((value) => value !== 0);
};

const useSensorData = () => {
  const [sensorData, setSensorData] = useState(initialSensorState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const primaryRef = ref(realtimeDb, 'RespiraGuard/sensors');
    const fallbackRef = ref(realtimeDb, 'sensors');

    const handleSnapshot = (snapshot) => {
      const normalized = normalizePayload(snapshot.val());
      if (hasAnySensorValue(normalized)) {
        setSensorData(normalized);
      }
      setLoading(false);
      setError(null);
    };

    const handleError = (firebaseError) => {
      setError(firebaseError.message || 'Unable to read sensor data');
      setLoading(false);
    };

    const unsubscribePrimary = onValue(primaryRef, handleSnapshot, handleError);
    const unsubscribeFallback = onValue(fallbackRef, (snapshot) => {
      const normalized = normalizePayload(snapshot.val());
      setSensorData((previous) => {
        if (!hasAnySensorValue(previous) && hasAnySensorValue(normalized)) {
          return normalized;
        }
        return previous;
      });
    });

    return () => {
      unsubscribePrimary();
      unsubscribeFallback();
    };
  }, []);

  return {
    ...sensorData,
    loading,
    error
  };
};

export default useSensorData;
