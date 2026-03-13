import React from 'react';

const AIInsightCard = () => {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-800">AI Health Insight</h3>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Warning
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <p>Current risk level is Moderate.</p>
        <p>Air quality levels are elevated today.</p>
        <p>Avoid outdoor pollution and monitor breathing regularly.</p>
      </div>
    </article>
  );
};

export default AIInsightCard;
