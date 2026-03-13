import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from './firebase';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

const formatDisplayDate = (value) => {
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

const statusClass = {
  Normal: 'bg-emerald-100 text-emerald-700',
  Warning: 'bg-amber-100 text-amber-700',
  Critical: 'bg-rose-100 text-rose-700'
};

const RespiratoryDataPage = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const loadSessions = async () => {
      setLoading(true);
      try {
        const sessionsRef = collection(db, 'users', user.uid, 'sessions');
        const sessionsQuery = query(sessionsRef, orderBy('createdAt', 'desc'), limit(50));
        const sessionsSnapshot = await getDocs(sessionsQuery);

        const sessionData = sessionsSnapshot.docs.map((sessionDoc) => ({
          id: sessionDoc.id,
          ...sessionDoc.data()
        }));

        setSessions(sessionData);
      } catch (error) {
        console.error('Failed to load respiratory sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  const userName = useMemo(() => {
    return user?.displayName || user?.email?.split('@')[0] || 'RespiraGuard User';
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading respiratory data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          role="Patient"
        />

        <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Respiratory Data</h2>
            <p className="mt-1 text-sm text-slate-500">
              Stored therapy sessions with duration, risk level, and AI insights.
            </p>
          </section>

          <article className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Duration</th>
                    <th className="px-3 py-3 font-medium">AQI</th>
                    <th className="px-3 py-3 font-medium">Risk Level</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">AI Insight</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <tr key={session.id} className="border-b border-slate-100 align-top text-slate-700">
                        <td className="px-3 py-3">{formatDisplayDate(session.createdAt || session.sessionDate)}</td>
                        <td className="px-3 py-3">{session.sessionDurationLabel || '00:00:00'}</td>
                        <td className="px-3 py-3">{session.airQualityIndex ?? 'N/A'} AQI</td>
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
                        <td className="max-w-md px-3 py-3 text-slate-600">
                          {session.aiRecommendation || 'No AI recommendation available for this session.'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                        No saved respiratory sessions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default RespiratoryDataPage;
