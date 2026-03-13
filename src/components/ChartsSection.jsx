import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

const formatLabel = (value) => {
  if (!value) return 'N/A';

  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return 'N/A';
};

const riskToScore = (riskLevel) => {
  if (riskLevel === 'High') return 85;
  if (riskLevel === 'Low') return 25;
  return 55;
};

const chartBaseClass = 'rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]';

const ChartsSection = ({ sessions = [] }) => {
  const fallback = [
    { day: 'Mon', airQualityIndex: 64, breathingScore: 78, riskScore: 42 },
    { day: 'Tue', airQualityIndex: 70, breathingScore: 82, riskScore: 48 },
    { day: 'Wed', airQualityIndex: 68, breathingScore: 79, riskScore: 45 },
    { day: 'Thu', airQualityIndex: 76, breathingScore: 84, riskScore: 55 },
    { day: 'Fri', airQualityIndex: 74, breathingScore: 86, riskScore: 52 },
    { day: 'Sat', airQualityIndex: 72, breathingScore: 83, riskScore: 50 },
    { day: 'Sun', airQualityIndex: 69, breathingScore: 85, riskScore: 46 }
  ];

  const normalized = sessions
    .slice()
    .reverse()
    .slice(-7)
    .map((session) => ({
      day: formatLabel(session.createdAt || session.sessionDate),
      airQualityIndex: session.airQualityIndex ?? 0,
      breathingScore: session.breathingScore ?? 0,
      riskScore: riskToScore(session.riskLevel)
    }));

  const chartData = normalized.length > 0 ? normalized : fallback;

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className={chartBaseClass}>
        <h3 className="text-base font-semibold text-slate-800">Weekly Air Quality Trend</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="airQualityIndex" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={chartBaseClass}>
        <h3 className="text-base font-semibold text-slate-800">Breathing Pattern Trend</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="breathingScore" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={chartBaseClass}>
        <h3 className="text-base font-semibold text-slate-800">Respiratory Risk Prediction</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="riskScore" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
};

export default ChartsSection;
