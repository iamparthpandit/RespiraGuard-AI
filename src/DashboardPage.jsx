import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import SummaryCards from './components/SummaryCards';
import ChartsSection from './components/ChartsSection';
import AIInsightCard from './components/AIInsightCard';
import PatientProfileCard from './components/PatientProfileCard';
import SessionTable from './components/SessionTable';

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Welcome back, Parth 👋</h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor your respiratory health insights and AI predictions.
            </p>
          </section>

          <SummaryCards />
          <ChartsSection />

          <section className="grid gap-4 xl:grid-cols-2">
            <AIInsightCard />
            <PatientProfileCard />
          </section>

          <SessionTable />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
