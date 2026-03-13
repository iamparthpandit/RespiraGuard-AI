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

const airQualityData = [
  { day: 'Mon', value: 64 },
  { day: 'Tue', value: 70 },
  { day: 'Wed', value: 68 },
  { day: 'Thu', value: 76 },
  { day: 'Fri', value: 74 },
  { day: 'Sat', value: 72 },
  { day: 'Sun', value: 69 }
];

const breathingPatternData = [
  { day: 'Mon', value: 78 },
  { day: 'Tue', value: 82 },
  { day: 'Wed', value: 79 },
  { day: 'Thu', value: 84 },
  { day: 'Fri', value: 86 },
  { day: 'Sat', value: 83 },
  { day: 'Sun', value: 85 }
];

const riskPredictionData = [
  { week: 'W1', value: 32 },
  { week: 'W2', value: 40 },
  { week: 'W3', value: 37 },
  { week: 'W4', value: 45 }
];

const chartBaseClass = 'rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]';

const ChartsSection = () => {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className={chartBaseClass}>
        <h3 className="text-base font-semibold text-slate-800">Weekly Air Quality Trend</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={airQualityData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={chartBaseClass}>
        <h3 className="text-base font-semibold text-slate-800">Breathing Pattern Trend</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={breathingPatternData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={chartBaseClass}>
        <h3 className="text-base font-semibold text-slate-800">Respiratory Risk Prediction</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskPredictionData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
              <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
};

export default ChartsSection;
