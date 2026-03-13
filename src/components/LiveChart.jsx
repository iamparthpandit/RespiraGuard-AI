import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import useSensorData from '../hooks/useSensorData';

const MAX_POINTS = 20;

const LiveChart = () => {
  const { air_quality, temperature, humidity, sound } = useSensorData();
  const [history, setHistory] = useState([]);

  const point = useMemo(() => ({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    air_quality,
    temperature,
    humidity,
    sound
  }), [air_quality, temperature, humidity, sound]);

  useEffect(() => {
    setHistory((previous) => [...previous.slice(-MAX_POINTS + 1), point]);
  }, [point]);

  return (
    <section className="rounded-xl bg-white p-6 shadow-md transition-all duration-300">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Live Respiratory Monitoring</h2>
        <p className="mt-1 text-sm text-slate-500">Streaming updates in Realtime</p>
      </header>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 12, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="air_quality" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="humidity" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sound" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default LiveChart;
