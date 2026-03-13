import React from 'react';

const AIInsightCard = ({
  insight,
  riskLevel = 'Moderate Risk',
  aiRecommendation = '',
  sensorData = {},
  predictionError = ''
}) => {
  const normalizedRisk =
    riskLevel === 'Low' || riskLevel === 'Low Risk'
      ? 'Low Risk'
      : riskLevel === 'High' || riskLevel === 'High Risk'
      ? 'High Risk'
      : 'Moderate Risk';

  const badgeClass =
    normalizedRisk === 'Low Risk'
      ? 'bg-emerald-100 text-emerald-700'
      : normalizedRisk === 'High Risk'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-amber-100 text-amber-700';

  const fallbackText = insight?.lines?.join(' ') ||
    'Air quality exposure and respiratory indicators suggest moderate stress. Monitor breathing conditions.';
  const recommendation = aiRecommendation || fallbackText;

  return (
    <article className="rounded-xl shadow-md bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-800">AI Respiratory Risk Insight</h3>
        <span className="text-xs font-medium text-emerald-700">🟢 AI Monitoring Active</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-slate-600">Respiratory Risk Level:</span>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {normalizedRisk}
        </span>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommendation</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{recommendation}</p>
      </div>

      {predictionError ? (
        <p className="mt-3 text-sm font-medium text-rose-600">Prediction service temporarily unavailable.</p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">
        <span>AQI: {sensorData?.air_quality ?? 0}</span>
        <span>Humidity: {sensorData?.humidity ?? 0}</span>
        <span>Temp: {sensorData?.temperature ?? 0}</span>
        <span>Sound: {sensorData?.sound ?? 0}</span>
      </div>
    </article>
  );
};

export default AIInsightCard;
