import React from 'react';

const AIInsightCard = ({ insight, riskLevel = 'Moderate' }) => {
  const lines = insight?.lines?.length
    ? insight.lines
    : [
        `Current risk level is ${riskLevel}.`,
        'Air quality levels are elevated today.',
        'Avoid outdoor pollution and monitor breathing regularly.'
      ];

  const badgeClass =
    riskLevel === 'Low'
      ? 'bg-emerald-100 text-emerald-700'
      : riskLevel === 'High'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-amber-100 text-amber-700';

  return (
    <article className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-800">AI Health Insight</h3>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {riskLevel}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
};

export default AIInsightCard;
