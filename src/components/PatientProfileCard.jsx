import React from 'react';

const PatientProfileCard = ({ profile }) => {
  const fullName = profile?.fullName || 'RespiraGuard User';
  const patientId = profile?.patientId || 'RG-2026-0000';
  const respiratoryCondition = profile?.respiratoryCondition || 'Mild Asthma';
  const lastMonitoringSession = profile?.lastMonitoringSession || 'No session yet';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'RG';

  return (
    <article className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <h3 className="text-base font-semibold text-slate-800">Patient Profile</h3>

      <div className="mt-5 flex items-center gap-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{fullName}</p>
          <p className="text-xs text-slate-500">Patient ID: {patientId}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <dt className="text-slate-500">Respiratory Condition</dt>
          <dd className="font-medium text-slate-700">{respiratoryCondition}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Last Monitoring Session</dt>
          <dd className="font-medium text-slate-700">{lastMonitoringSession}</dd>
        </div>
      </dl>
    </article>
  );
};

export default PatientProfileCard;
