import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { db } from './firebase';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import SummaryCards from './components/SummaryCards';
import ChartsSection from './components/ChartsSection';
import AIInsightCard from './components/AIInsightCard';
import PatientProfileCard from './components/PatientProfileCard';
import SessionTable from './components/SessionTable';
import SensorDashboard from './components/SensorDashboard';
import LiveChart from './components/LiveChart';
import useSensorData from './hooks/useSensorData';
import {
  generateAIRecommendation,
  getRespiratoryPrediction
} from './services/aiPredictionService';

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

const DashboardPage = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [riskLevel, setRiskLevel] = useState('');
  const [aiRecommendation, setAIRecommendation] = useState('');
  const [sensorData, setSensorData] = useState({});
  const [predictionError, setPredictionError] = useState('');
  const lastPredictionAtRef = useRef(0);
  const isPredictingRef = useRef(false);
  const {
    air_quality,
    humidity,
    sound,
    temperature,
    loading: liveLoading
  } = useSensorData();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          const defaultProfile = buildDefaultProfile(user);
          await setDoc(userRef, defaultProfile, { merge: true });
          setProfile({ ...defaultProfile, createdAt: null, updatedAt: null });
        } else {
          setProfile(userSnapshot.data());
        }

        const sessionsRef = collection(db, 'users', user.uid, 'sessions');
        const sessionsQuery = query(sessionsRef, orderBy('createdAt', 'desc'), limit(20));
        let sessionsSnapshot = await getDocs(sessionsQuery);

        if (sessionsSnapshot.empty) {
          await seedInitialSessions(user.uid);
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
    };

    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (liveLoading) {
      return;
    }

    const latestSensorData = {
      air_quality,
      humidity,
      sound,
      temperature
    };

    setSensorData(latestSensorData);

    const hasValidSensorValues = Object.values(latestSensorData).some(
      (value) => Number.isFinite(value) && value !== 0
    );

    if (!hasValidSensorValues || isPredictingRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastPredictionAtRef.current < 5000) {
      return;
    }

    lastPredictionAtRef.current = now;
    isPredictingRef.current = true;

    const runPrediction = async () => {
      try {
        setPredictionError('');
        const prediction = await getRespiratoryPrediction(latestSensorData);
        const predictedRisk = prediction?.risk_level || 'Moderate Risk';

        setRiskLevel(predictedRisk);

        const generatedRecommendation = await generateAIRecommendation(
          predictedRisk,
          latestSensorData,
          prediction?.recommendation
        );

        setAIRecommendation(generatedRecommendation);
      } catch (error) {
        console.error('Prediction pipeline failed:', error);
        setPredictionError('Prediction service temporarily unavailable.');
        setAIRecommendation('Prediction service temporarily unavailable.');
      } finally {
        isPredictingRef.current = false;
      }
    };

    runPrediction();
  }, [air_quality, humidity, liveLoading, sound, temperature]);

  const derivedMetrics = useMemo(() => {
    const latest = sessions[0];
    const profileMetrics = profile?.metrics || {};

    return {
      airQualityIndex: !liveLoading ? air_quality : (latest?.airQualityIndex ?? profileMetrics.airQualityIndex ?? 72),
      temperature: !liveLoading ? temperature : (latest?.temperature ?? profileMetrics.temperature ?? 0),
      humidity: !liveLoading ? humidity : (latest?.humidity ?? profileMetrics.humidity ?? 0),
      breathingSoundIntensity: !liveLoading ? sound : (latest?.breathingSoundIntensity ?? profileMetrics.breathingSoundIntensity ?? 0),
      respiratoryRiskLevel: riskLevel || latest?.riskLevel || profileMetrics.respiratoryRiskLevel || 'Moderate Risk',
      dailyBreathingScore: latest?.breathingScore ?? profileMetrics.dailyBreathingScore ?? 84,
      sessionsRecorded: sessions.length
    };
  }, [air_quality, humidity, liveLoading, profile, riskLevel, sessions, sound, temperature]);

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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 live-badge-glow">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 live-dot-glow" />
              <span>Live Sensor Stream</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Welcome back, {userName}!</h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor your respiratory health insights and AI predictions.
            </p>
          </section>

          <SummaryCards metrics={derivedMetrics} />

          <section className="space-y-4 rounded-2xl bg-white/70 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800">ESP32 Live Sensor Add-on</h3>
              <span className="text-xs font-medium text-emerald-700">
                {liveLoading ? 'Connecting to Firebase stream...' : 'Streaming in real time'}
              </span>
            </div>
            <SensorDashboard />
            <LiveChart />
          </section>

          <ChartsSection sessions={sessions} />

          <section className="grid gap-4 xl:grid-cols-2">
            <AIInsightCard
              insight={profileWithLatestSession?.aiInsight}
              riskLevel={riskLevel || derivedMetrics.respiratoryRiskLevel}
              aiRecommendation={aiRecommendation}
              sensorData={sensorData}
              predictionError={predictionError}
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
