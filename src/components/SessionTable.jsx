import React from 'react';
import { useNavigate } from 'react-router-dom';

const statusClass = {
  Normal: 'bg-emerald-100 text-emerald-700',
  Warning: 'bg-amber-100 text-amber-700',
  Critical: 'bg-rose-100 text-rose-700'
};

const formatDate = (value) => {
  if (!value) return 'N/A';

  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const SessionTable = ({ sessions = [], user }) => {
  const navigate = useNavigate();
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
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <tr
                  key={session.id}
                  onClick={() => navigate(`/report/${session.id}`)}
                  className="cursor-pointer border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition"
                >
                  <td className="px-3 py-3">{formatDate(session.createdAt || session.sessionDate)}</td>
                  <td className="px-3 py-3">{session.airQualityIndex ?? 'N/A'} AQI</td>
                  <td className="px-3 py-3">{session.breathingScore ?? 'N/A'}</td>
                  <td className="px-3 py-3">{session.riskLevel || 'N/A'}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusClass[session.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {session.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  No previous session data found for this user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default SessionTable;
