import React from 'react';

const summaryData = [
  {
    title: 'Air Quality Index',
    value: '72 AQI',
    badge: 'Moderate',
    badgeClass: 'bg-amber-100 text-amber-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 13a4 4 0 0 1 4-4h10a4 4 0 0 1 0 8H8" strokeLinecap="round" />
        <path d="M7 17a3 3 0 1 0 0-6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'Respiratory Risk Level',
    value: 'Moderate',
    badge: 'Watch',
    badgeClass: 'bg-orange-100 text-orange-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4v8" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
        <path d="M5 20h14L12 4 5 20Z" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'Daily Breathing Score',
    value: '84 / 100',
    badge: 'Stable',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12h4l2-4 4 8 2-4h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'Sessions Recorded',
    value: '128',
    badge: 'This month',
    badgeClass: 'bg-blue-100 text-blue-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M8 10h8M8 14h5" strokeLinecap="round" />
      </svg>
    )
  }
];

const SummaryCards = () => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryData.map((card) => (
        <article key={card.title} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{card.value}</p>
            </div>
            <span className="rounded-lg bg-slate-100 p-2 text-slate-600">{card.icon}</span>
          </div>
          <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.badgeClass}`}>
            {card.badge}
          </span>
        </article>
      ))}
    </section>
  );
};

export default SummaryCards;
