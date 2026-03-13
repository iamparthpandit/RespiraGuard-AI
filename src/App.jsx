import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import DashboardPage from './DashboardPage';
import RespiratoryDataPage from './RespiratoryDataPage';
import { auth } from './firebase';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
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
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute user={user}>
              <DashboardPage user={user} />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/respiratory-data"
          element={(
            <ProtectedRoute user={user}>
              <RespiratoryDataPage user={user} />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;