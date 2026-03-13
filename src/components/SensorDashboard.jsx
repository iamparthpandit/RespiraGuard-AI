import useSensorData from '../hooks/useSensorData';

const SensorDashboard = () => {
  const { air_quality, temperature, humidity, sound, loading, error } = useSensorData();

  const cards = [
    {
      title: 'Air Quality',
      value: air_quality,
      unit: 'AQI'
    },
    {
      title: 'Temperature',
      value: temperature,
      unit: '°C'
    },
    {
      title: 'Humidity',
      value: humidity,
      unit: '%'
    },
    {
      title: 'Breathing Sound Level',
      value: sound,
      unit: 'dB'
    }
  ];

  return (
    <>
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              animationDelay: `${index * 90}ms`
            }}
          >
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {loading ? '--' : card.value}
              {!loading && <span className="ml-2 text-sm font-medium text-slate-500">{card.unit}</span>}
            </p>
          </article>
        ))}
      </section>
    </>
  );
};

export default SensorDashboard;
