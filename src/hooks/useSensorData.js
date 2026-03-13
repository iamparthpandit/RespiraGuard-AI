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

const useSensorData = () => {
  const [sensorData, setSensorData] = useState(initialSensorState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sensorsRef = ref(realtimeDb, 'RespiraGuard/sensors');

    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        const data = snapshot.val() || {};

        setSensorData({
          air_quality: toNumber(data.air_quality),
          humidity: toNumber(data.humidity),
          sound: toNumber(data.sound),
          temperature: toNumber(data.temperature)
        });

        setLoading(false);
        setError(null);
      },
      (firebaseError) => {
        setError(firebaseError.message || 'Unable to read sensor data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    ...sensorData,
    loading,
    error
  };
};

export default useSensorData;
