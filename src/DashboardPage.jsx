import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import SummaryCards from './components/SummaryCards';
import ChartsSection from './components/ChartsSection';
import AIInsightCard from './components/AIInsightCard';
import PatientProfileCard from './components/PatientProfileCard';
import SessionTable from './components/SessionTable';

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

const buildDefaultProfile = (firebaseUser) => {
  const fullName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'RespiraGuard User';
  const patientId = `RG-${new Date().getFullYear()}-${firebaseUser.uid.slice(0, 4).toUpperCase()}`;

  return {
    fullName,
    role: 'Patient',
    email: firebaseUser.email || '',
    patientId,
    respiratoryCondition: 'Mild Asthma',
    lastMonitoringSession: 'No session yet',
    metrics: {
      airQualityIndex: 72,
      temperature: 29,
      humidity: 58,
      breathingSoundIntensity: 42,
      respiratoryRiskLevel: 'Moderate',
      dailyBreathingScore: 84,
      sessionsRecorded: 0
    },
    aiInsight: {
      riskLevel: 'Moderate',
      lines: [
        'Current risk level is Moderate.',
        'Air quality levels are elevated today.',
        'Avoid outdoor pollution and monitor breathing regularly.'
      ]
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
};

const seedInitialSessions = async (uid) => {
  const sessionsRef = collection(db, 'users', uid, 'sessions');
  const seedSessions = [
    {
      airQualityIndex: 72,
      temperature: 29,
      humidity: 58,
      breathingSoundIntensity: 42,
      breathingScore: 84,
      riskLevel: 'Low',
      status: 'Normal',
      createdAt: new Date('2026-03-12T10:00:00')
    },
    {
      airQualityIndex: 110,
      temperature: 31,
      humidity: 64,
      breathingSoundIntensity: 69,
      breathingScore: 68,
      riskLevel: 'Moderate',
      status: 'Warning',
      createdAt: new Date('2026-03-10T10:00:00')
    }
  ];

  await Promise.all(seedSessions.map((session) => addDoc(sessionsRef, session)));
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/auth', { replace: true });
        return;
      }

      setLoading(true);
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          const defaultProfile = buildDefaultProfile(firebaseUser);
          await setDoc(userRef, defaultProfile, { merge: true });
          setProfile({ ...defaultProfile, createdAt: null, updatedAt: null });
        } else {
          setProfile(userSnapshot.data());
        }

        const sessionsRef = collection(db, 'users', firebaseUser.uid, 'sessions');
        const sessionsQuery = query(sessionsRef, orderBy('createdAt', 'desc'), limit(20));
        let sessionsSnapshot = await getDocs(sessionsQuery);

        if (sessionsSnapshot.empty) {
          await seedInitialSessions(firebaseUser.uid);
          sessionsSnapshot = await getDocs(sessionsQuery);
        }

        const sessionData = sessionsSnapshot.docs.map((sessionDoc) => ({
          id: sessionDoc.id,
          ...sessionDoc.data()
        }));

        setSessions(sessionData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const derivedMetrics = useMemo(() => {
    const latest = sessions[0];
    const profileMetrics = profile?.metrics || {};

    return {
      airQualityIndex: latest?.airQualityIndex ?? profileMetrics.airQualityIndex ?? 72,
      temperature: latest?.temperature ?? profileMetrics.temperature ?? 0,
      humidity: latest?.humidity ?? profileMetrics.humidity ?? 0,
      breathingSoundIntensity: latest?.breathingSoundIntensity ?? profileMetrics.breathingSoundIntensity ?? 0,
      respiratoryRiskLevel: latest?.riskLevel ?? profileMetrics.respiratoryRiskLevel ?? 'Moderate',
      dailyBreathingScore: latest?.breathingScore ?? profileMetrics.dailyBreathingScore ?? 84,
      sessionsRecorded: sessions.length
    };
  }, [profile, sessions]);

  const profileWithLatestSession = useMemo(() => {
    return {
      ...profile,
      lastMonitoringSession:
        sessions.length > 0
          ? formatDisplayDate(sessions[0].createdAt || sessions[0].sessionDate)
          : profile?.lastMonitoringSession || 'No session yet'
    };
  }, [profile, sessions]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading dashboard...
      </div>
    );
  }

  const userName = profileWithLatestSession?.fullName || 'RespiraGuard User';
  const userRole = profileWithLatestSession?.role || 'Patient';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          role={userRole}
        />

        <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Welcome back, {userName}!</h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor your respiratory health insights and AI predictions.
            </p>
          </section>

          <SummaryCards metrics={derivedMetrics} />
          <ChartsSection sessions={sessions} />

          <section className="grid gap-4 xl:grid-cols-2">
            <AIInsightCard
              insight={profileWithLatestSession?.aiInsight}
              riskLevel={derivedMetrics.respiratoryRiskLevel}
            />
            <PatientProfileCard profile={profileWithLatestSession} />
          </section>

          <SessionTable sessions={sessions} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
