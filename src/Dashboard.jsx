import SensorDashboard from './components/SensorDashboard';
import LiveChart from './components/LiveChart';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <span>LIVE SENSOR STREAM</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            RespiraGuard Live Monitoring
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Real-time respiratory environment data from IoT sensors.
          </p>
        </header>

        <SensorDashboard />
        <LiveChart />
      </div>
    </div>
  );
};

export default Dashboard;
