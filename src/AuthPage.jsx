import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

const normalizeEmail = (email) => email.trim().toLowerCase();

const getAuthErrorMessage = (err) => {
  const code = err?.code || '';

  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password is disabled in Firebase. Enable it in Authentication > Sign-in method.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    default:
      return err?.message || 'Something went wrong. Please try again.';
  }
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createDefaultUserData = async (user, fullName, email) => {
    const patientId = `RG-${new Date().getFullYear()}-${user.uid.slice(0, 4).toUpperCase()}`;

    await setDoc(
      doc(db, 'users', user.uid),
      {
        fullName,
        role: 'Patient',
        email,
        patientId,
        respiratoryCondition: 'Mild Asthma',
        metrics: {
          airQualityIndex: 72,
          temperature: 29,
          humidity: 58,
          breathingSoundIntensity: 42,
          respiratoryRiskLevel: 'Moderate',
          dailyBreathingScore: 84,
          sessionsRecorded: 2
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
      },
      { merge: true }
    );

    await Promise.all([
      addDoc(collection(db, 'users', user.uid, 'sessions'), {
        airQualityIndex: 72,
        temperature: 29,
        humidity: 58,
        breathingSoundIntensity: 42,
        breathingScore: 84,
        riskLevel: 'Low',
        status: 'Normal',
        createdAt: new Date('2026-03-12T10:00:00')
      }),
      addDoc(collection(db, 'users', user.uid, 'sessions'), {
        airQualityIndex: 110,
        temperature: 31,
        humidity: 64,
        breathingSoundIntensity: 69,
        breathingScore: 68,
        riskLevel: 'Moderate',
        status: 'Warning',
        createdAt: new Date('2026-03-10T10:00:00')
      })
    ]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const email = normalizeEmail(formData.email);
      await signInWithEmailAndPassword(auth, email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setMessage(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const email = normalizeEmail(formData.email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const fullName = formData.name.trim() || 'RespiraGuard User';
      await createDefaultUserData(userCredential.user, fullName, email);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setMessage(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const email = normalizeEmail(formData.email);
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      setMessage(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/src/assets/lung-animation.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      <div className="relative z-10 min-h-screen flex flex-col md:grid md:grid-cols-2">
        <div className="flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-xl bg-white/85 p-8 shadow-lg backdrop-blur-md">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
              </h1>
              <p className="mt-2 text-gray-600">
                {mode === 'login'
                  ? 'Sign in with your email and password.'
                  : mode === 'signup'
                  ? 'Create your account using email and password.'
                  : 'Enter your email to receive a reset link.'}
              </p>
            </div>

            {message && <p className="mb-4 text-center text-sm text-red-600">{message}</p>}

            <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handlePasswordReset}>
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="mb-2 block text-gray-700">Full Name</label>
                  <div className="rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="mb-2 block text-gray-700">Email</label>
                <div className="rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent outline-none"
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <>
                  <div className="mb-4">
                    <label className="mb-2 block text-gray-700">Password</label>
                    <div className="rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div className="mb-4">
                      <label className="mb-2 block text-gray-700">Confirm Password</label>
                      <div className="rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full bg-transparent outline-none"
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {mode === 'login' && (
                <div className="mb-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage('');
                      setMode('forgot');
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="mb-4 w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Sign In'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Send Reset Link'}
              </button>
            </form>

            {mode === 'login' && (
              <p className="text-center">
                Do not have an account?{' '}
                <button
                  onClick={() => {
                    setMessage('');
                    setMode('signup');
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p className="text-center">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMessage('');
                    setMode('login');
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p className="text-center">
                <button
                  onClick={() => {
                    setMessage('');
                    setMode('login');
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="hidden md:block" />
      </div>
    </section>
  );
};

export default AuthPage;
