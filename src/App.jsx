import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import RespiratoryDataPage from './RespiratoryDataPage';
import ReportPage from './ReportPage';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setAuthLoading(false);
        return;
      }

      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Anonymous sign-in failed:', error);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Checking authentication...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage user={user} />} />
        <Route path="/respiratory-data" element={<RespiratoryDataPage user={user} />} />
        <Route path="/report/:sessionId" element={<ReportPage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;