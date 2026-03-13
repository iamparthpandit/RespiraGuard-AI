import React from 'react';

const sessions = [
  {
    date: 'Mar 12, 2026',
    airQuality: '72 AQI',
    breathingScore: '84',
    riskLevel: 'Low',
    status: 'Normal'
  },
  {
    date: 'Mar 10, 2026',
    airQuality: '110 AQI',
    breathingScore: '68',
    riskLevel: 'Moderate',
    status: 'Warning'
  },
  {
    date: 'Mar 08, 2026',
    airQuality: '89 AQI',
    breathingScore: '76',
    riskLevel: 'Low',
    status: 'Normal'
  }
];

const statusClass = {
  Normal: 'bg-emerald-100 text-emerald-700',
  Warning: 'bg-amber-100 text-amber-700'
};

const SessionTable = () => {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <h3 className="text-base font-semibold text-slate-800">Recent Sessions</h3>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Air Quality</th>
              <th className="px-3 py-3 font-medium">Breathing Score</th>
              <th className="px-3 py-3 font-medium">Risk Level</th>
              <th className="px-3 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={`${session.date}-${session.airQuality}`} className="border-b border-slate-100 text-slate-700">
                <td className="px-3 py-3">{session.date}</td>
                <td className="px-3 py-3">{session.airQuality}</td>
                <td className="px-3 py-3">{session.breathingScore}</td>
                <td className="px-3 py-3">{session.riskLevel}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[session.status]}`}>
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default SessionTable;
